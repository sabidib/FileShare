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

globalShareGroup = new ShareGroup('global');
shareGroups = {};
shareGroups[globalShareGroup.getShareGroupID()] = globalShareGroup;

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

    socket.on('disconnect',function(socket){
        console.log('They left!!');
    });

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

  socket.on('getUsersOnline',function(data){
    //todo: make sure it's valid user that has been authenticated
    var response = {'users':[]} 
    for (var i = server.clients.length - 1; i >= 0; i--) {
        response['users'].push(server.clients[i].getUsername());
    }
    socket.emit('getUsersOnlineResponse',response);
  });


  socket.on('getAllShareGroups',function(data){
    //todo: make sure it's valid user that has been authenticated
    var response = {'shareGroups':[]} 
    for(i in shareGroups){
        response['shareGroups'].push({'name': shareGroups[i].getShareGroupName() , 
                                'id' : shareGroups[i].getShareGroupID()
                            });
    }
    socket.emit('getAllShareGroupsResponse',response);
  });

  socket.on('createShareGroup' ,function(data){
    var s = new ShareGroup(data['name']); 
    shareGroups.push(s);
    socket.emit('createShareGroupResponse',{'sucess':true});
  });

  socket.on('notifyServerOfClientsFiles',function(data){
    var files = data['files'];
    for (var i = data['shareGroups'].length - 1; i >= 0; i--) {
        client.addShareGroup(data['shareGroups'][i]);
    };

    for (var i = files.length - 1; i >= 0; i--) {
        for (var j = data['shareGroups'].length - 1; j >= 0; j--) {
            if(shareGroups[data['shareGroups'][j]] != undefined){
                group = shareGroups[data['shareGroups'][j]];
                console.log('added a file');
                var file = new File(files[i].name,files[i].type,client,group)       
            }
        };
    };
    console.log(client.files);
  })



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
