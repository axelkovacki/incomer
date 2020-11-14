const hrtime = require('./hrtime');
const { spawn } = require('child_process');
const Log = require('../services/log');

function exec(command = '', params = [], id = null, observation = null) {
  try {
    let timer = hrtime.now('mili');
    let payload = {
      id,
      command,
      params,
      observation,
      type: null,
      data: null,
      ms: 0
    };
  
    const spawnProcess = spawn(command, params);

    spawnProcess.stdout.on('data', async data => {
      payload = {
        ...payload,
        type: 'exec-success',
        data: data.toString(),
        ms: hrtime.now('mili') - timer
      };

      await Log.create(payload);
    });
  
    spawnProcess.stderr.on('data', async data => {
      payload = {
        ...payload,
        type: 'exec-error',
        data: data.toString(),
        ms: hrtime.now('mili') - timer
      };

      await Log.create(payload);
    });
  
    spawnProcess.on('error', async error => {
      payload = {
        ...payload,
        type: 'exec-error',
        data: error.message,
        ms: hrtime.now('mili') - timer
      };

      await Log.create(payload);
    });
  
    spawnProcess.on('close', async code => await Log.create(payload));
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  exec
}