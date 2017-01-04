var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String
});

userSchema.statics.findByEmail = function (email) {
  return console.log("is this hitting");
  // return this.model('User').find({email: email});
}

userSchema.methods.test = function test(){
}

var User = mongoose.model('User', userSchema);

module.exports = User;
