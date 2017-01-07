var dbURI    = 'mongodb://localhost/mapchat',
    should   = require('chai').should(),
    mongoose = require('mongoose'),
    User = require('../models/user'),
    ChatRoom = require('../models/chat_room'),
    clearDB  = require('mocha-mongoose')(dbURI);

describe("ChatRooms", function(){
  beforeEach(function(done){
    //always connect to db before tests
    if(mongoose.connection.db) return done();

    mongoose.connect(dbURI, done);
  });

  before(function(done){
    clearDB(done);
  });

  it("can be saved", function(done){
    var newUser = new User({
      firstName: "test",
      lastName: "test",
      email: "test",
      password: "test"
    });

    newUser.save(function(err, user) {
      if(err) return done(err);

      var newChatRoom = new ChatRoom({
        roomName: "Test Room",
        user: user._id
      });

      newChatRoom.save(function(err, chat){
        if(err) return done(err);
        done();
      });
    });
  });

  it("can be saved and listed", function(done){
    var newUser = new User({
      firstName: "test",
      lastName: "test",
      email: "test",
      password: "test"
    });

    newUser.save(function(err, user) {
      if(err) return done(err);

      var newChatRoom = new ChatRoom({
        roomName: "Test Room",
        user: user._id
      });

      newChatRoom.save(function(err, chat){
        if(err) return done(err);

        ChatRoom.find({}, function(err, docs){
          docs.length.should.eq(1);
          done();
        });
      });
    });
  });

  it("can insert many chat rooms", function(done){
    var newUser = new User({
      firstName: "test",
      lastName: "test",
      email: "test",
      password: "test"
    });

    newUser.save(function(err, user) {
      if(err) return done(err);

      var chatRooms = [
        { roomName: "Test Room 1", users: user._id },
        { roomName: "Test Room 2", users: user._id },
        { roomName: "Test Room 3", users: user._id }
      ];

      ChatRoom.insertMany(chatRooms, function(err, docs){
        if(err) return done(err);

        ChatRoom.count({}, function(err, count){
          count.should.eq(chatRooms.length);
          done();
        });
      });
    });
  });

  it("can delete a chatroom", function(done){
    var newUser = new User({
      firstName: "test",
      lastName: "test",
      email: "test",
      password: "test"
    });

    newUser.save(function(err, user) {
      if(err) return done(err);

      var newChatRoom = new ChatRoom({ roomName: "Test Room", users: user._id });

      newChatRoom.save(function(err, chatroom){
        if(err) return done(err);

        ChatRoom.remove({ roomName: chatroom.roomName }, function(err, doc){
          if(err) return done(err);

          ChatRoom.count({}, function(err, count){
            if(err) return done(err);

            count.should.eq(0);
            done();
          });
        });
      });
    });
  });


});
