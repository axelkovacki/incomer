const hrtime = require('./hrtime');
const { spawn } = require('child_process');
const Log = require('../services/log');

function exec(command = '', params = [], groupId = null, observation = null) {
  try {
    let timer = hrtime.now('mili');
    let payload = {
      groupId,
      command,
      params,
      observation,
      status: null,
      data: null,
      ms: 0
    };
  
    const spawnProcess = spawn(command, params);

    spawnProcess.stdout.on('data', async data => {
      payload = {
        ...payload,
        status: 'success',
        data: data.toString(),
        ms: hrtime.now('mili') - timer
      };
      console.log(payload)
      await Log.create(payload);
    });
  
    spawnProcess.stderr.on('data', async data => {
      payload = {
        ...payload,
        status: 'error',
        data: data.toString(),
        ms: hrtime.now('mili') - timer
      };

      await Log.create(payload);
    });
  
    spawnProcess.on('error', async error => {
      payload = {
        ...payload,
        status: 'error',
        data: error.message,
        ms: hrtime.now('mili') - timer
      };

      await Log.create(payload);
    });
  
    spawnProcess.on('close', async code => await Log.create(payload));
  } catch (err) {
    console.log(err);
  };
};

module.exports = {
  exec
}