var mongoose = require('mongoose');
var Schema = mongoose.schema;

var userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String
});

var User = mongoose.model('User', userSchema);

module.exports = User;
