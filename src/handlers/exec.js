const hrtime = require('./hrtime');
const { spawn } = require('child_process');
const Log = require('../services/log');
const Request = require('../services/request');

async function exec(command = '', params = [], groupId = null, observation = null, afterCall = {}) {
  try {
    let timer = hrtime.now('mili');
    let payload = {
      groupId,
      command,
      params,
      observation,
      status: null,
      data: null,
      ms: null
    };

    const { _id : logId } = await Log.create(payload);

    const spawnProcess = spawn(command, params);

    spawnProcess.stdout.on('data', data => {
      payload = {
        ...payload,
        status: 'success',
        data: data.toString(),
        ms: hrtime.now('mili') - timer
      };
    });
  
    spawnProcess.stderr.on('data', data => {
      payload = {
        ...payload,
        status: 'error',
        data: data.toString(),
        ms: hrtime.now('mili') - timer
      };
    });
  
    spawnProcess.on('error', error => {
      payload = {
        ...payload,
        status: 'error',
        data: error.message,
        ms: hrtime.now('mili') - timer
      };
    });
  
    spawnProcess.on('close', async code => {
      await Log.updateOne({ _id: logId }, payload);
      await Request.make({
        ...afterCall,
        data: payload.data
      });
    });
  } catch (err) {
    console.log(err);
  };
};

module.exports = {
  exec
}