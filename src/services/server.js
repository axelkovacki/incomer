const fastify = require('fastify')({ logger: true });
const Log = require('./log');
const { exec } = require('../handlers/exec');

async function start() {
  function isInWhiteList(ip = '') {
    if (!ip) {
      return false;
    }

    const whitelist = process.env.WHITELIST ? process.env.WHITELIST.split(',') : [];

    return whitelist.includes(ip);
  };

  try {
    fastify.register(require('fastify-cors'));
    
    fastify.post('/send', async (request, reply) => {
      if (!isInWhiteList(request.ip)) {
        return reply.code('400').send({ content: 'Unauthorized IP' });
      }
      
      const { groupId, command, params, observation, afterCall } = request.body;
      
      if (!command) {
        return reply.code('400').send({ content: 'Invalid Body' });
      }

      exec(command, params || [], `${groupId}`, observation, afterCall);

      return reply.send({ content: 'Command sended' });
    });

    fastify.get('/log', async (request, reply) => {
      return reply.send({ content: await Log.find().sort('-createdAt') });
    });

    fastify.get('/log/group/:groupId', async (request, reply) => {
      const { groupId } = request.params;
      
      if (!groupId) {
        return reply.code('400').send({ content: 'Invalid Param' });
      }

      return reply.send({ content: await Log.find({ groupId }).sort('-createdAt') });
    });

    await fastify.listen(3000);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

module.exports = {
  start
};
