var mongoose = require('mongoose');
var User = require('../models/user');

module.exports.controller = function(app) {

  app.get('/login', function(req, res) {
    res.render('login');
  });
}
