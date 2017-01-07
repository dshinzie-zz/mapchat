var dbURI    = 'mongodb://localhost/mapchat',
    should   = require('chai').should(),
    mongoose = require('mongoose'),
    User = require('../models/user'),
    clearDB  = require('mocha-mongoose')(dbURI);

describe("Chats", function(){
  beforeEach(function(done){
    //always connect to db before tests
    if(mongoose.connection.db) return done();

    mongoose.connect(dbURI, done);
  });

  before(function(done){
    clearDB(done);
  });

  it("can be saved", function(done){
    new User({
      firstName: "test",
      lastName: "test",
      email: "test",
      password: "test"
    }).save(function(err, user) {

      if(err) return done(err);

      console.log(user);
      done();
    });
  });
});
