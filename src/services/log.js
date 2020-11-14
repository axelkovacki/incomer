const { Schema, model } = require('mongoose');

const LogSchema = new Schema({
  groupId: String,
  command: String,
  params: Array,
  status: String,
  data: String,
  observation: String,
  ms: String,
}, {
  timestamps: true
});

module.exports = model('Log', LogSchema);