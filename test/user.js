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

  // before(function(done) {
  //   clearDB(done);
  // });

  it("can be saved", function(done) {
    new User(
      { firstName: "test",
        lastName: "test",
        email: "test",
        password: "test"
      }
    ).save(done);
  });

  it("can be created", function(done) {
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
});
