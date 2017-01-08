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

//bootstrap
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

var expressLayouts = require('express-ejs-layouts');

//mongo db setup
var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/mapchat');
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




// app.use('/', index);
// app.use('/login', index);
// app.use('/users', users);

// var chatrooms = require('./routes/chatrooms');
// app.use('/chatrooms', chatrooms);




// sockets
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);
console.log("Listening on port 3000");


//Custom chatroom!!!!!
var ChatRoom = require('./models/chat_room');
var promise = getChatRoom();
promise.then(function(rooms){
  console.log(rooms);

  rooms.forEach(function(room){
    console.log('/' + room._id);

    var customRoom = io.of('/' + room._id);

    customRoom.on('connection', function(socket){
      console.log(`User connected to room: ${room.roomName}`);

      socket.on('send message', function(msg){
        //message received from client
        console.log('message: ' +  msg);

        //send message back to client for everyone to see
        customRoom.emit('send message', msg);
      });

      //leaving room
      socket.on('disconnect', function(){
        console.log('User disconnected');
      });
    });


  });

});

function getChatRoom(){
  var promise = ChatRoom.find({}).exec();
  return promise;
}


io.on('connection', function(socket){
  console.log("User connected");

  socket.on('send message', function(msg){
    //message received from client
    console.log('message: ' +  msg);

    //send message back to client for everyone to see
    io.emit('send message', msg);
  });

  socket.on('disconnect', function(){
    console.log('User disconnected');
  });
});





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

  res.render("index");
});

google.options({
  auth: oauth2Client
});

function getGoogleToken (googleClient, code) {
  googleClient.getToken(code, function (err, tokens) {
    if (!err) {
      googleClient.setCredentials(tokens);
      console.log(googleClient);
      session["token"] = tokens;
      getGoogleProfile(googleClient);
      }
  });
}

function getGoogleProfile(googleClient) {
  plus.people.get({ userId: 'me', auth: googleClient }, function(err, profile) {
    if(err) {
      return console.log(err);
    }
      console.log(profile);
      session["googleId"] = profile["id"]
  });
}

// function findOrCreateUser(googleProfile, session["token"]){
//
// }


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
