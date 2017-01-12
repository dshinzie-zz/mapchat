var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  email: { type: String, required: true },
  password: { type: String, required: true },
  googleId: { type: Number, default: null },
  token: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

userSchema.statics.findByEmail = function (email) {
  return this.model('User', userSchema).findOne({ email: email });
}

userSchema.statics.findOrCreateUser = function(profile, token, cb){
  var query = { googleId: profile["id"] },
      update = { expire: new User() },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };

  return this.model('User', userSchema).findOneAndUpdate(query, update, options, function(error, result) {
    if (error) {
      console.log(error);
      return cb(null);
    } else {
      result.googleId = profile["id"];
      result.token = token;
      result.firstName = profile["name"]["givenName"];
      result.lastName = profile["name"]["familyName"];
      return cb(result);
    };
  });
}

var User = mongoose.model('User', userSchema);

module.exports = User;
