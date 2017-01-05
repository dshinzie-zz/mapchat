var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.statics.findByEmail = function (email) {
  return this.model('User', userSchema).findOne({ email: email });
}

userSchema.methods.test = function test(){
}

var User = mongoose.model('User', userSchema);

module.exports = User;
