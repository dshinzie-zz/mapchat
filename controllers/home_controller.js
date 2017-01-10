var mongoose = require('mongoose');
var User = require('../models/user');
var ChatRoom = require('../models/chat_room');
var Message = require('../models/message');

module.exports.controller = function(app) {

  app.get('/', function(req, res, next) {
    ChatRoom.find({}, function(err, rooms){
      User.find({}, function(err, users){
        res.render('index', { title: 'MapChat', rooms: rooms, users: users });
      });
    });
  });

}
