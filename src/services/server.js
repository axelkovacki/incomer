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
    fastify.post('/send', async (request, reply) => {
      if (!isInWhiteList(request.ip)) {
        return reply.code('400').send({ content: 'Unauthorized IP' });
      }
      
      const { id, command, params, observation } = request.body;

      if (!command) {
        return reply.code('400').send({ content: 'Invalid Body' });
      }

      exec(command, params || [], `${id}`, observation);

      return { content: 'Command sended' };
    });

    fastify.get('/log/:id', async (request, reply) => {
      if (!isInWhiteList(request.ip)) {
        return reply.code('400').send({ content: 'Unauthorized IP' });
      }

      const { id } = request.params;
      
      if (!id) {
        return reply.code('400').send({ content: 'Invalid Param' });
      }

      return { content: await Log.find({ id }) };
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
