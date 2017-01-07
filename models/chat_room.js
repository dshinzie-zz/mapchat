var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatRoomSchema = new Schema({
  roomName: { type: String, required: true, unique: true },
  users: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now }
});

var ChatRoom = mongoose.model('Chat', chatRoomSchema);

module.exports = ChatRoom;
