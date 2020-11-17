const Fastify = require('fastify')({ logger: true });

async function start() {
  try {
    Fastify.register(require('fastify-cors'));
    Fastify.register(require('./routes'));
    await Fastify.listen(3001);
    Fastify.log.info(`server listening on ${Fastify.server.address().port}`);
  } catch (err) {
    Fastify.log.error(err);
    process.exit(1);
  }
}

module.exports = {
  start
};
