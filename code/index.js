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
    response = {'success' : false};
    client = new Client(data['username'],server,socket,session);
    client.setStatusToLoggedIn();
    response = {'success' : true};
    console.log(data['username'] + " has logged in successfully!");
    socket.emit('loginUserResponse',response);
  });

  socket.on('logoutUser',function(data){
    response = {'success' : false};        
    for (var i = server.clients.length - 1; i >= 0; i--) {
        if(server.clients[i].getUsername() == data['username']){
          server.removeClient(server.clients[i]);
          response = {'success' : true};                    
          console.log(data['username'] + " has logged out successfully!"); 
          break;
       }
    };    
    socket.emit('logoutUserResponse',response);
  });

  socket.on('getUsersOnline',function(data){
    //todo: make sure it's valid user that has been authenticated
    var response = {'users':[]} 
    for (var i = server.clients.length - 1; i >= 0; i--) {
        response['users'].push({'username': server.clients[i].getUsername() });
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

  socket.on('getShareGroupsForUser',function(data){
    var response = [] 
    var username = data.username;
        for (var i = server.clients.length - 1; i >= 0; i--) {
            if(server.clients[i].username == username){
                for (var j = server.clients[i].shareGroupsThatIAmIn.length - 1; j >= 0; j--) {
                    var group = server.clients[i].shareGroupsThatIAmIn[j];
                    response.push({'id' : group.getShareGroupID(),
                                    'name' : group.getShareGroupName()
                                });
                };
            }
        };
    socket.emit('getShareGroupsForUserResponse',response)
  });

  socket.on('createShareGroup' ,function(data){
    var s = new ShareGroup(data['name']); 
    shareGroups[s.getShareGroupID()] = s;
    socket.emit('createShareGroupResponse',{'sucess':true, 'id' : s.getShareGroupID()});
  });

  socket.on('getFilesFromShareGroup',function(data){
    var response = {'files' : {}};
    var id = data['id'];
    var amount = data['amount'];
    var group = shareGroups[id];
    var c = 0;
    for(var i in group.files){
        if(c == amount ){
            break;
        }   
        f = group.files[i];
        response['files'][i] = {
            'name' : f.getFileName(),
            'id' : f.getFileID(),
            'user' : f.client.username,
            'shareGroup' : {
                'id' : f.shareGroup.getShareGroupID(),
                'name' : f.shareGroup.getShareGroupName()
            } 
        }       
        c++; // Bjarne would be proud...jeeez
    }
    socket.emit('getFilesFromShareGroupResponse',response)
  });


  socket.on('getStream',function(data){
    var response = {'source': {} , 'destination' : {} , 'file_id': {} };
    var file_id = data.file_id;
    var group_id = data.share_group_id;

    var requested_file = getFileByIDFromShareGroupID(group_id,file_id);

    response.source = requested_file.client.username;
    response.destination = client.username;
    response.file_id = file_id;


    socket.emit('getStreamResponse',response);
  });



  socket.on('notifyServerOfClientsFiles',function(data){
    var files = data['files'];
    console.log(data);
    for (var i = data['shareGroups'].length - 1; i >= 0; i--) {
        client.addShareGroup(shareGroups[data['shareGroups'][i]]);
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
    file_info_to_return = [];
    for(var item in client.files){
        file_info_to_return.push({'name':client.files[item].getFileName(),
                                  'id':client.files[item].getFileID(),
                                  'shareGroup' :{
                                    'id' :  client.files[item].shareGroup.getShareGroupID(),
                                    'name' : client.files[item].shareGroup.getShareGroupName()
                                  }
                              });
    }

    socket.emit('notifyServerOfClientsFilesResponse',file_info_to_return);
  })

    socket.on('notifySourceToStartStream',function(stream){
        response = {"success" : false, "message" :""};

        source_client = {};
        for (var i = server.clients.length - 1; i >= 0; i--) {
            if(server.clients[i].username == stream.source){
                source_client = client;
            }
        };
        if(source_client = {}){
            //Fail!!
            response['message'] = "Could not find source client. They may have disconnected.";
            socket.emit('notifySourceToStartStreamReponse',response)
        }

        client.socket.emit('startStreaming',{"file_id": stream.file_id, "destination" : stream.destination});
        console.log(stream);
        response['success'] = true;
        response['message'] = "Started stream";

        socket.emit('notifySourceToStartStreamReponse',response)
    });

    socket.on('getCurrentlySharedFiles',function(){
        var files = [];
        for(var i in client.files){
            files.push({
                            'name' : client.files[i].getFileName() ,
                            'id' : client.files[i].getFileID()
                        });
        }
        socket.emit('getCurrentlySharedFilesResponse',files);
    });

    socket.on('addUsersToShareGroup',function(data){
        var group = shareGroups[data['shareGroupID']];
        var users_added = [];
        for (var i = data['usernames'].length - 1; i >= 0; i--) {
            for (var j = server.clients.length - 1; j >= 0; j--) {
                if(server.clients[j].username == data['usernames']){
                    group.addClient(server.clients[j]);
                    users_added.push({'username' : server.clients[j].username});
                }
            };
        };

        socket.emit('addUsersToShareGroupResponse',users_added);
    });



});


function getFileByIDFromShareGroupID(g_id,f_id){
    var group = shareGroups[g_id];
    console.log(group);
    for(file in group.files){
        if(file == f_id){
            return group.files[file];
        }
    } 
    return {};
}





var binaryServer = BinaryServer({port: 9000});

// Wait for new user connections
binaryServer.on('connection', function(c){
      // Incoming stream from browser
  c.on('stream',function(stream,meta){
    // Supa hacks
    if(meta['soMuchHacksWeNeedBinarySocketClientAssociatedWithClient'] != undefined){
        client.binarySocket = c;
        console.log("BIANRUY SOCKET");
    } else {
        
        var destination = meta.destination;

        var client_object_destination = {};

        for (var i = server.clients.length - 1; i >= 0; i--) {
            if(server.clients[i].username == destination){
                client_object_destination = server.clients[i];
            }
        };

        client_object_destination.binarySocket.send(stream,meta);

        stream.on('data', function(data){
          stream.write({rx: data.length / meta.size});
        });
    }
  });



});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
