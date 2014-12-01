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
var Utilities = require('./includes/Utilities.js');

var utils = new Utilities();


globalShareGroup = new ShareGroup('global');
shareGroups = {};
shareGroups[globalShareGroup.shareGroupID] = globalShareGroup;
server = new Server();

var session = {};

app.use(express.static(__dirname + '/public'));

key = "DoLphInsLoVEEProGaming$!%";


app.get('/', function(req, res) {
    cookies = new Cookies(req, res, key)

    session = new Session();
    cookies.set('id', session.sessionID, {
        maxAge: 60 * 24 * 30
    })

    res.sendFile(path.resolve('public/html/index.html'));
});

app.get('/test.html', function(req, res) {
    cookies = new Cookies(req, res, key)

    session = new Session();
    cookies.set('id', session.sessionID, {
        maxAge: 60 * 24 * 30
    })

    res.sendFile(path.resolve('public/html/test.html'));
});



io.on('connection', function(socket) {

    socket.on('disconnect', function(socket_dc) {                
        if(server.userExists(socket.username)){
            var client = server.clients[socket.username];        
            console.log(client.username + " has disconnected.");
            client.disconnectAllShareGroups();            
            client.removeAllFiles();
            server.removeClient(client);
        }
    });



    socket.on('isUserConnected', function(data) {
        response = {
            'isUserConnected': true
        };
        if (server.userExists(data['username'])) {
            socket.emit('isUserConnectedResponse', response);
            return;
        }        
        response['isUserConnected'] = false;
        utils.logInfo('isUserConnected',"Checking if " + data['username'] + " is connected." + "Found " + response['isUserConnected']);
        socket.emit('isUserConnectedResponse', response);
        return;
    });

    // Creates a client object and adds it to the server whenever a user logs in
    socket.on('loginUser', function(data) {
        var response = {};
        response['success'] = false;
        utils.logInfo('loginUser',"Logging in user: "  + data['username']);
        var client = new Client(data['username'], server, socket, session);
        client.setStatusToLoggedIn();
        response['success'] = true;
        server.addClient(client);
        socket.username = data['username'];
        socket.emit('loginUserResponse', response);
    });

    // Removes client object from the server on log out
    socket.on('logoutUser', function(data) {
        var response = {};
        response['success'] = false;
        if (server.removeClientByUser(data['username'])) {
            response['success'] = true;
            console.log(data['username'] + " has logged out successfully!");            
        }                
        socket.emit('logoutUserResponse', response);
    });

    socket.on('getUsersOnline', function(data) {
        //todo: make sure it's valid user that has been authenticated
        var response = {
            'users': []
        }
        for (var c in server.clients) {
            response['users'].push({
                'username': server.clients[c].username
            });
        };        
        socket.emit('getUsersOnlineResponse', response);
    });


    socket.on('getAllShareGroups', function(data) {
        //todo: make sure it's valid user that has been authenticated
        var response = {
            'shareGroups': []
        }
        for (var i in shareGroups) {
            response['shareGroups'].push({
                'name': shareGroups[i].name,
                'id': shareGroups[i].shareGroupID
            });
        }
        socket.emit('getAllShareGroupsResponse', response);
    });


    // Updates the share groups that a file is in:
    // Given a list of share groups and a file, remove the file from all the existing share groups it is in (reset),
    // and then add it to the list of share groups provided to the function.
    // If a file is part of no sharegroups, it is no longer on the server and can be safely deleted.
    socket.on('updateFileWithShareGroup', function(data) {
        var response = {};
        response['removed'] = false;
        if(!server.userExists(data['username'])){
            console.log("User " + data['username'] +" disconnected!");
            return;
        }
        var client = server.clients[data['username']];
        var getFileInfo = false;
        var file;
        // remove from existing share groups
        for (var i in shareGroups) {
            if (shareGroups[i].files[data['id']]) {
                file = shareGroups[i].files[data['id']];
                shareGroups[i].removeFile(file);
            }
        }        

        //add to new share groups (if any)  
        console.log(data['shareGroups']);
        if (data['shareGroups'] && data['shareGroups'].length > 0) {            
            for (var j = data['shareGroups'].length - 1; j >= 0; j--) {
                if (shareGroups[data['shareGroups'][j]] != undefined) {
                    group = shareGroups[data['shareGroups'][j]];
                    file = new File(file.name, file.fileType, client, group);
                }
            };
        } else {                         
            // delete file if no share groups are provided
            console.log("HERE");
            var f = client.files[data['id']];            
            f.deleteFile();  
            response['removed'] = true;
        }

        socket.emit('updateFileWithShareGroupResponse', response);
    });

    // Get all the sharegroups a certain file is in, along with the file info.
    socket.on('getShareGroupsForFile', function(data) {
        var response = {
            'file': {},
            'shareGroups': []            
        };
        var getFileInfo = false;
        for (var i in shareGroups) {
            if (shareGroups[i].files[data['id']]) {
                if (!getFileInfo) {
                    var file = shareGroups[i].files[data['id']];
                    response['file'] = {
                        'name': file.name,
                        'id': file.id
                    };
                    getFileInfo = false;
                }
                response['shareGroups'].push({
                    'name': shareGroups[i].name,
                    'id': shareGroups[i].shareGroupID
                });
            }
        }
        socket.emit('getShareGroupsForFileResponse', response);
    });

    // Get all the share groups that a certain user is in, along with the list of users in each of those share groups.
    socket.on('getShareGroupsForUser', function(data) {
        var response = []
        var username = data.username;                
        if (server.userExists(username)) {               
            var clientObj = server.clients[username];
            clientObj.shareGroupsThatIAmIn.forEach(function(group) {
                var clientsList = [];
                if (group.clients.length > 0){
                    // get list of users in this share group
                    group.clients.forEach(function(c) {
                        clientsList.push(c.username);
                    });
                }                

                // add share group info and list of users to response
                 response.push({
                    'id': group.shareGroupID,
                    'name': group.name,
                    'users': clientsList
                });
            });
        };        
        console.log(response);
        socket.emit('getShareGroupsForUserResponse', response)
    });
    
    // Create a sharegroup
    socket.on('createShareGroup', function(data) {
        var s = new ShareGroup(data['name']);
        shareGroups[s.shareGroupID] = s;
        socket.emit('createShareGroupResponse', {
            'success': true,
            'id': s.shareGroupID
        });
    });   

    // Get all the files that a user can stream or download by iterating through each sharegroup, and checking to see if client
    // is in that share group. If the client is in that group, add all the files from that group into the response.
    socket.on('getBrowsableFilesForUser', function(data) {
        var files = [];                
        if (server.userExists(data['username'])) {
            var client = server.clients[data['username']];
            client.shareGroupsThatIAmIn.forEach(function(s) {
                for (var f in s.files) {
                    files.push({
                            'name': s.files[f].name,
                            'id': s.files[f].id,
                            'user': s.files[f].client.username,
                            'type': s.files[f].fileType,
                            'shareGroup': {
                                'id': s.shareGroupID,
                                'name': s.name
                            }
                        });
                    }
            });
        }
        socket.emit('getBrowsableFilesForUserResponse', files)
    });

    // Get all the files that a certain user has uploaded, and iterate through share groups to check which share groups
    // this same file is currently in.
    socket.on('getFilesFromUser', function(data) {        
        var files = [];                        
        if (server.userExists(data['username'])) {
            var c = server.clients[data['username']];
            c.shareGroupsThatIAmIn.forEach(function(s) {                
                for (var f in c.files) {                    
                    if (s.files[f]) {
                        files.push({
                            'name': s.files[f].name,
                            'id': s.files[f].id,
                            'shareGroup': { 
                                'id': s.shareGroupID,
                                'name': s.name
                            }
                        });
                    }
                }
            });                
        }
        socket.emit('getFilesFromUserResponse', files)
    });

    // return stream information
    socket.on('getStream', function(data) {
        var response = {
            'success':false,
            'source': {},
            'destination': {},
            'file_id': {}
        };

        var file_id = data.file_id;
        var group_id = data.share_group_id;

        var requested_file = shareGroups[group_id].files[file_id];
        if (requested_file) {
            if (requested_file.client) {            
                response.success = true;
                response.source = requested_file.client.username;
                response.destination = data.destination_username;
                response.file_id = file_id;
            }
        }

        message = "Connected stream for file:" + response.file_id + " with destination " + response.destination +" and source " + response.source;

        utils.logInfo("getStream","Data is " + JSON.stringify(data)+ ". Found that" + message)

        socket.emit('getStreamResponse', response);
    });


    // This is used to update clients and sharegroups whenever a user selects files that they want to share.
    socket.on('notifyServerOfClientsFiles', function(data) {
        var files = data['files'];                        
        if(!server.userExists(data['username_to_add_to'])){
            console.log("attempted to add files to user " + data['username_to_add_to'] + " which does not exist anymore!");
            return null;
        }
        var client = server.clients[data['username_to_add_to']];
        var group;        
        if(data['shareGroups'])  {
            // add all selected files to all selected sharegroups
            for (var i = data['shareGroups'].length - 1; i >= 0; i--) {
                client.addShareGroup(shareGroups[data['shareGroups'][i]]);
                group = shareGroups[data['shareGroups'][i]];
                for (var i = files.length - 1; i >= 0; i--) {                    
                    // set client as owner of this file
                    var file = new File(files[i].name, files[i].type, client, group)
                }
            };     
        }
        // return the uploaded files
        file_info_to_return = [];
        for (var item in client.files) {
            file_info_to_return.push({
                'name': client.files[item].name,
                'id': client.files[item].id,
                'shareGroup': {
                    'id': client.files[item].shareGroup.shareGroupID,
                    'name': client.files[item].shareGroup.name
                }
            });
        }        
        socket.emit('notifyServerOfClientsFilesResponse', file_info_to_return);
    })
    
    // Gives the source the stream info required to start streaming to the destination (i.e: start sending packets)
    socket.on('notifySourceToStartStream', function(stream) {
        response = {
            "success": false,
            "message": ""
        };

        utils.logInfo("notifySourceToStartStream","Stream to start is " + JSON.stringify(stream))        
        if (!server.userExists(stream.source)) {
            //Fail!!
            console.log("FAILED!");
            response['message'] = "Could not find source client. They may have disconnected.";
            socket.emit('notifySourceToStartStreamReponse', response)
            return;
        }
        var source_client = server.clients[stream.source];

        source_client.socket.emit('startStreaming', {
            "file_id": stream.file_id,
            "destination": stream.destination,
            "download": stream.download
        });      
        response['success'] = true;
        response['message'] = "Started stream";

        socket.emit('notifySourceToStartStreamReponse', response)
    });

    // Get all the files uploaded by a user
    socket.on('getCurrentlySharedFiles', function(data) {                
        if(!server.userExists(data['username'])){
            console.log("User disconnected!");
            return;
        }
        var files = [];
        var client = server.clients[data['username']];

        for (var i in client.files) {
            files.push({
                'name': client.files[i].name,
                'id': client.files[i].id
            });
        }
        socket.emit('getCurrentlySharedFilesResponse', files);
    });


    // Adds a list of users to 1 share group specified by an ID
    socket.on('addUsersToShareGroup', function(data) {
        var group = shareGroups[data['shareGroupID']];
        var users_added = [];
        for (var i = data['usernames'].length - 1; i >= 0; i--) {
            var user = data['usernames'][i];
            if (server.userExists(user)) {
                group.addClient(server.clients[user]);
                users_added.push({ 
                    'username': user
                });
            }            
        };
        socket.emit('addUsersToShareGroupResponse', users_added);
    });



});

var binaryServer = BinaryServer({
    port: 9000
});

// Wait for new user connections
binaryServer.on('connection', function(c) {
    // Incoming stream from browser
    c.on('stream', function(stream, meta) {
        // Supa hacks
        if (meta['username_get_socket'] != undefined) {
            if (server.userExists(meta['username_get_socket'])) {
                server.clients[meta['username_get_socket']].binarySocket = c;
                console.log(meta['username_get_socket'] +" had their binarySocket set.");            
            }
        } else {

            var destination = meta.destination;
            if (server.userExists(destination)) {
                var client_object_destination = {};
                client_object_destination = server.clients[destination];
                client_object_destination.binarySocket.send(stream, meta);

                stream.on('data', function(data) {
                    stream.write({
                        rx: data.length / meta.size
                    });
                });
            }
        }
    });



});


http.listen(3000, function() {
    console.log('listening on *:3000');
});