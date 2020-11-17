const mongoose = require('mongoose');

function start() {
  try {
    mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });   
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  start
};
