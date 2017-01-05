var dbURI    = 'mongodb://localhost/mapchat'
  , should   = require('chai').should()
  , mongoose = require('mongoose')
  , User = require('../models/user')
  , clearDB  = require('mocha-mongoose')(dbURI)
;

describe("Users", function() {
  beforeEach(function(done) {
    if (mongoose.connection.db) return done();

    mongoose.connect(dbURI, done);
  });

  before(function(done) {
    clearDB(done);
  });

  it("can be saved", function(done) {
    new User(
      { firstName: "test",
        lastName: "test",
        email: "test",
        password: "test"
      }
    ).save(done);
  });

  it("can be saved and listed", function(done) {
    new User(
      { firstName: "test",
        lastName: "test",
        email: "test",
        password: "test"
      }).save(function(err, model) {

      if(err) return done(err);

      User.find({}, function(err, docs){
        docs.length.should.eq(1);
        done();
      });
    });
  });

  it("can insert many", function(done) {
    var users = [
      { firstName: "test", lastName: "test", email: "test", password: "test" },
      { firstName: "test2", lastName: "test2", email: "test2", password: "test2" },
      { firstName: "test3", lastName: "test3", email: "test3", password: "test3" }
    ];

    User.insertMany(users, function(err, docs) {
      if(err){
        return done(err);
      } else {
        User.count({}, function(err, count) {
          count.should.eq(users.length);
          done();
        });
      }
    });
  });

  it("can find user by email", function(done){
    var newUser = new User(
      { firstName: "test",
        lastName: "test",
        email: "test",
        password: "test"
      }).save(function(err, model) {

        if(err) return done(err);
        //how do I access newUser.email?
        User.findByEmail("test")
        .then(function(user){
          user.email.should.eq("test");
          done();
        });
    });
  });



});
