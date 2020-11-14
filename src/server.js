require('dotenv').config();

const fastify = require('fastify')({ logger: true });

const mongoose = require('mongoose');
const Log = require('./services/Log');

const { exec } = require('./handlers/exec');

const start = async () => {
  try {
    mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}?retryWrites=true&w=majority`, {
      useNewUrlParser: true
    });

    fastify.post('/send', async (request, reply) => {
      const { id, command, params, observation } = request.body;

      if (!command) {
        return reply.code('400').send({ content: 'Invalid Body' });
      }

      exec(command, params || [], `${id}`, observation);

      return { content: 'Command sended' };
    });

    fastify.get('/log/:id', async (request, reply) => {
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

start();