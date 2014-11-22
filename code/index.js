var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);
var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');
var Cookies = require('cookies')
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');


var File = require('./includes/File.js'); // testing File class
var ShareGroup = require('./includes/ShareGroup.js'); // testing ShareGroup class
var Server = require('./includes/Server.js');
var Session = require('./includes/Session.js')
var Client = require('./includes/Client.js')
globalShareGroup = new ShareGroup();

server = new Server();

var session = {};
var client = {};

app.use(express.static(__dirname + '/public'));

key = "DoLphInsLoVEEProGaming$!%";

app.get('/', function(req, res){
    cookies = new Cookies( req, res, key )
    
    session = new Session();
    cookies.set('id',session.getSessionID(), { maxAge: 60*24*30})

    res.sendFile(path.resolve('public/html/index.html'));
});


io.on('connection', function(socket){

  socket.on('isUserConnected',function(data){
        response = {'isUserConnected': true};
        for (var i = server.clients.length - 1; i >= 0; i--) {
          if(server.clients[i].getUsername() == data['username']){
            socket.emit('isUserConnectedResponse',response);
            return;
          }
        };
        response['isUserConnected'] = false;
        socket.emit('isUserConnectedResponse',response);
        return;
    });


  socket.on('loginUser',function(data){
    response = {'success' : false}
    client = new Client(data['username'],server,socket,session);
    client.setStatusToLoggedIn();
    response = {'success' : true}
    console.log(data['username'] + " has logged in successfully!");
    socket.emit('loginUserResponse',response);
  });


});




var binaryServer = BinaryServer({port: 9000});

// Wait for new user connections
binaryServer.on('connection', function(client){
      // Incoming stream from browsers
   


  // client.on('stream', function(stream, meta){
  //   var shareGroup = new ShareGroup();
  //   var file = new File(meta.name, meta.path, meta.path, meta.type, client);
  //   shareGroup.addFile(file);
  //   shareGroup.addClient(client);    
  //   stream.on('data', function(data){
  //     stream.write({rx: data.length / meta.size});
  //   });
  //   //
  // });


});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
