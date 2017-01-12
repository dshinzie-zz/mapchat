var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatRoomSchema = new Schema({
  roomName: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

var ChatRoom = mongoose.model('Chat', chatRoomSchema);

module.exports = ChatRoom;
