var mongoose = require('mongoose');
var User = require('../models/user');

module.exports.controller = function(app) {

  app.get('/signup', function(req, res) {
    res.render('users/new');
  });

  app.get('/login', function(req, res) {
    res.render('login');
  });

  app.post('/users', function(req, res) {
    User.create({
      firstName: req.body["new-first"],
      lastName: req.body["new-last"],
      email: req.body["new-email"],
      password: req.body["new-password"]
    }).then(function(user) {
      res.redirect('/')
    });
  });

}
