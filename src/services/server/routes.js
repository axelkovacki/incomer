const Log = require('../log');
const Handler = require('../handler');

module.exports = function (fastify, opts, next) {
  function isInWhiteList(ip = '') {
    if (!ip) {
      return false;
    }
  
    const whitelist = process.env.WHITELIST ? process.env.WHITELIST.split(',') : [];
  
    return whitelist.includes(ip);
  };
  
  fastify.post('/send', async (request, reply) => {
    if (!isInWhiteList(request.ip)) {
      return reply.code('400').send({ content: 'Unauthorized IP' });
    }
  
    const { groupId, command, params, observation, afterCall } = request.body;
  
    if (!command) {
      return reply.code('400').send({ content: 'Invalid Body' });
    }
  
    const payload = {
      command,
      params: params || [],
      groupId: `${groupId}`,
      observation,
      afterCall
    }

    Handler.start(payload);

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
  
  next();
}