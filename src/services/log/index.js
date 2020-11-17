const { Schema, model } = require('mongoose');

const LogSchema = new Schema({
  groupId: String,
  queueName: String,
  command: String,
  params: Array,
  status: String,
  data: Array,
  observation: String,
  ms: String,
}, {
  timestamps: true
});

module.exports = model('Log', LogSchema);