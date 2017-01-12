var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var fs = require('fs');
var app = express();

//google oauth
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var plus = google.plus('v1');
var authKeys = require('./config/google_auth').googleAuth;
var User = require('./models/user');

var session = require('express-session');
app.use(session({
  name: 'mapchat-cookie',
  secret: 'keyboard cat',
  saveUninitialized: true,
  resave: true,
  cookie: { maxAge: 60000 }
}));

//bootstrap
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

// statics
app.use('/node_modules', express.static(__dirname + '/node_modules')); // redirect bootstrap JS
app.use('/bower_components', express.static(__dirname + '/bower_components')); // redirect bootstrap JS

var expressLayouts = require('express-ejs-layouts');

//mongo db setup
var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/mapchat');
mongoose.connect('MONGODB_URI: mongodb://heroku_xs48mxff:nsq2u8fe8rq7os598egcgqtuta@ds159998.mlab.com:59998/heroku_xs48mxff');

mongoose.connection.on('connected', function() {
  console.log('Mongoose default connection open to ' + mongoose.connection.name);
})
app.listen(mongoose.connection.port, function(err){
  if(err) throw err;
  console.log("MongoDB listening on port " + mongoose.connection.port);
})


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




// sockets
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);
console.log("Listening on port 3000");

//Custom chatroom!!!!!
var ChatRoom = require('./models/chat_room');
var User = require('./models/user');
var Message = require('./models/message');


//connect to global chat room
var chatRoomPromise = getChatRooms();
chatRoomPromise.then(function(rooms){
  rooms.forEach(function(room){
    console.log('Creating connections for room: ' + room._id);

    var customRoom = io.of('/' + room._id);

    customRoom.on('connection', function(socket){

      if(global.currentUser){
        thisUser = global.currentUser.firstName;
      } else {
        thisUser = "Guest";
      }

      console.log(`${thisUser} connected to room: ${room.roomName}`);

      //message received from client
      socket.on('send message', function(msg){
        console.log('Message received from client: ' +  msg);

        //create message for history
        var newMessage = new Message({
          content: msg,
          chatroom: room,
          user: global.currentUser
        }).save(function(err, message){
          if(err) {
            console.log(err);
            return err;
          } else {
            console.log("Message saved");
            //send model based message back to client for everyone to see
            customRoom.emit('send message', message.content);
          }
        });
      });

      //location received from client
      socket.on('send location', function(msg){
        console.log('Location received from client: ' +  msg);

        var newMessage = new Message({
          content: msg,
          chatroom: room,
          location: msg,
          user: global.currentUser
        }).save(function(err, message){
          if(err) {
            console.log(err);
            return err;
          } else {
            console.log("Message saved");
            //send model based message back to client for everyone to see
            customRoom.emit('send location', message.content);
          }
        });
      });

      //leaving room
      socket.on('disconnect', function(){
        console.log(`User disconnected from room: ${room.roomName}`);
      });
    });
  });
});

//connect to direct message room
var userPromise = getUsers();
userPromise.then(function(users){
  users.forEach(function(user){
    console.log('Creating connections for user: ' + user._id);

    var customRoom = io.of('/' + user._id);

    customRoom.on('connection', function(socket){

      if(global.currentUser){
        thisUser = global.currentUser.firstName;
      } else {
        thisUser = "Guest";
      }

      console.log(`${thisUser} connected to user: ${user.firstName} ${user.lastName} `);

      //message received from client
      socket.on('send message', function(msg){
        console.log('Message: received from client: ' +  msg);

        //create message for history
        var newMessage = new Message({
          content: msg,
          chatroom: user,
          user: global.currentUser
        }).save(function(err, message){
          if(err) {
            console.log(err);
            return err;
          } else {
            console.log("Message saved");
            //send model based message back to client for everyone to see
            customRoom.emit('send message', message.content);
          }
        });
      });

      //leaving room
      socket.on('disconnect', function(){
        console.log(`User disconnected from room: ${user.firstName} ${user.lastName}`);
      });
    });
  });

});

function getChatRooms(){
  var promise = ChatRoom.find({}).exec();
  return promise;
}

function getUsers(){
  var promise = User.find({}).exec();
  return promise;
}




//google oauth
var oauth2Client = new OAuth2(authKeys.clientId, authKeys.clientSecret, authKeys.callbackUrl);

var scopes = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/plus.login'
];

var url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes
});

app.locals.authUrl = url;
app.locals.authUser = url //find user id/ store in model;

app.get("/auth/google/callback", function(req, res) {
  var code = req.query.code;
  console.log("Callback code is: " + code);

  getGoogleToken(oauth2Client, code);

  res.redirect("/");
});

google.options({
  auth: oauth2Client
});

function getGoogleToken (googleClient, code) {
  googleClient.getToken(code, function (err, tokens) {
    if (!err) {
      googleClient.setCredentials(tokens);
      console.log("Google Client credentials set");

      session["token"] = tokens;
      console.log("Tokens saved to session");

      getGoogleProfile(googleClient, function(user){
        global.currentUser = user;
        global.fullName = `${user.firstName}`;
      });
    }
  });

}

function getGoogleProfile(googleClient, cb) {
  plus.people.get({ userId: 'me', auth: googleClient }, function(err, profile) {
    if(err) return console.log(err);

    session["googleId"] = profile["id"]
    console.log("Google ID saved to session.");

    //get user
    User.findOrCreateUser(profile, session["token"]["access_token"], function(user){
      session["userId"] = user._id;
      console.log("User ID saved to session.");
      return cb(user);
    });
  });
}




// setup MVCish structure
fs.readdirSync('./controllers').forEach(function(file){
  if(file.substr(-3) == '.js'){
    route = require('./controllers/' + file);
    route.controller(app);
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
