var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatSchema = new Schema({
  roomName: { type: String, required: true },
  message: { type: String, default: null },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
  created_at: { type: Date, default: Date.now }
});

var Chat = mongoose.model('Chat', chatSchema);

module.exports(Chat);
