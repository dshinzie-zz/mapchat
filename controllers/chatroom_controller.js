var mongoose = require('mongoose');
var User = require('../models/user');
var ChatRoom = require('../models/chat_room');

module.exports.controller = function(app) {

  app.get('/chatrooms/new', function(req, res) {
    res.render('chatrooms/new');
  });

  app.post('/chatrooms', function(req, res){
    ChatRoom.create({
      roomName: req.body["chat-name"],
      description: req.body["chat-description"]
    }).then(function(chatroom){
      res.redirect('/chatrooms/' + chatroom._id)
    });
  });

  app.get('/chatrooms/:id', function(req, res){
    res.render('chatrooms/show');
  });
  

}
