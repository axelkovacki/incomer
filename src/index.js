require('dotenv').config();
const database = require('./services/database');
const server = require('./services/server');

function start() {
  try {
    database.start();
    server.start();
  } catch(err) {
    console.log(err);
  }
}

start();