const { Schema, model } = require('mongoose');

const LogSchema = new Schema({
  id: String,
  command: String,
  params: Array,
  type: String,
  data: String,
  observation: String,
  ms: String,
}, {
  timestamps: true
});

module.exports = model('Log', LogSchema);