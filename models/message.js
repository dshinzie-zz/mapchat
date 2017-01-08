var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  content: { type: String, default: null },
  chatroom: { type: Schema.Types.ObjectId, ref: 'ChatRoom' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;
