const { spawn } = require('child_process');
const Log = require('../log');
const Hrtime = require('../hrtime');

async function start(payload = {}) {
  try {
    let timer = Hrtime.now('mili');

    const spawnProcess = spawn(payload.command, payload.params);

    payload = {
      ...payload,
      pid: spawnProcess.pid,
      status: 'processing',
      data: [],
      ms: 0
    };

    const { _id : logId } = await Log.create(payload);

    spawnProcess.stdout.on('data', data => {
      payload.data.push({
        type: 'stdout',          
        message: data.toString()
      });

      console.log('stdout: ', data);
    });
  
    // cUrl span stderr in execution. So I discard this log for now.
    // spawnProcess.stderr.on('data', data => {
    //   payload.data.push({
    //     type: 'stderr',          
    //     message: data.toString()
    //   });
    // });
  
    spawnProcess.on('error', error => {
      payload.data.push({
        type: 'error',          
        message: error.message
      });

      console.log('error: ', data);
    });
  
    spawnProcess.on('close', async code => {
      payload.status = 'finish';
      payload.ms = Hrtime.now('mili') - timer;

      console.log('payload: ', payload)

      await Log.updateOne({ _id: logId }, payload);
    });
  } catch(err) {
    console.log(err);
  }
}

module.exports = {
  start
}