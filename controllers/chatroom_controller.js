var mongoose = require('mongoose');
var User = require('../models/user');
var ChatRoom = require('../models/chat_room');

module.exports.controller = function(app) {

  app.get('/chatrooms/index', function(req, res){
    ChatRoom.find({}, function(err, rooms){
      User.find({}, function(err, users){
        res.render('chatrooms/index', { title: 'MapChat', rooms: rooms, users: users });
      });
    });
  });

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
    var thisUser;

    if(global.currentUser){
      thisUser = global.currentUser.firstName;
    } else {
      thisUser = "Guest";
    }
    res.render('chatrooms/show', { thisUser: thisUser });
  });

  app.get('/chatrooms/users/:id', function(req, res){
    var thisUser;

    if(global.currentUser){
      thisUser = global.currentUser.firstName;
    } else {
      thisUser = "Guest";
    }
    res.render('chatrooms/dm', { thisUser: thisUser });
  });


}
