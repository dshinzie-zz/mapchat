var dbURI    = 'mongodb://localhost/mapchat',
    should   = require('chai').should(),
    mongoose = require('mongoose'),
    User = require('../models/user'),
    ChatRoom = require('../models/chat_room'),
    Message = require('../models/message'),
    clearDB  = require('mocha-mongoose')(dbURI);

describe("Messages", function(done){
  beforeEach(function(done){
    if(mongoose.connection.db) return done();

    mongoose.connect(dbURI, done);
  });

  before(function(done){
    clearDB(done);
  });

  it("can be saved", function(done){
    var newMessage = new Message({ content: "Test" });

    newMessage.save(function(err, msg){
      if(err) return done(err);
      done();
    })
  })

  it("can be tied to a user", function(done){
    var newUser = new User({
      firstName: "test",
      lastName: "test",
      email: "test",
      password: "test"
    });

    newUser.save(function(err, user){
      if(err) return done(err);

      var newMessage = new Message({
        content: "Test",
        user: user._id
      });

      newMessage.save(function(err, msg){
        if(err) return done(err);

        Message.findOne({ content: "Test" }, function(err, doc){
          if(err) return done(err);

          doc.user.toString().should.eq(user._id.toString());
          done();
        });
      });
    });
  });

  it("can be tied to a chatroom", function(done){
    var newChatRoom = new ChatRoom({ roomName: "Test" });

    newChatRoom.save(function(err, chatroom){
      if(err) return done(err);

      var newMessage = new Message({
        content: "Test",
        chatroom: chatroom._id
      });

      newMessage.save(function(err, msg){
        if(err) return done(err);

        Message.findOne({ content: "Test" }, function(err, doc){
          if(err) return done(err);

          doc.chatroom.toString().should.eq(chatroom._id.toString());
          done();
        });
      });
    });
  });

});
