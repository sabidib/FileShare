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
shareGroups[globalShareGroup.getShareGroupID()] = globalShareGroup;

server = new Server();

var session = {};
var client = {};

app.use(express.static(__dirname + '/public'));

key = "DoLphInsLoVEEProGaming$!%";


app.get('/', function(req, res) {
    cookies = new Cookies(req, res, key)

    session = new Session();
    cookies.set('id', session.getSessionID(), {
        maxAge: 60 * 24 * 30
    })

    res.sendFile(path.resolve('public/html/index.html'));
});



io.on('connection', function(socket) {

    socket.on('disconnect', function(socket_dc) {
        console.log(socket);
        console.log(socket.username);
        var current_client = undefined;
        for (var i = server.clients.length - 1; i >= 0; i--) {
            if(server.clients[i].username == socket.username){
                current_client = server.clients[i];
            }
        };
        if(current_client != undefined){
            console.log(current_client);
            current_client.disconnectAllShareGroups();
            current_client.removeAllFiles();
            server.removeClient(current_client);
        }
    });



    socket.on('isUserConnected', function(data) {
        response = {
            'isUserConnected': true
        };
        for (var i = server.clients.length - 1; i >= 0; i--) {
            if (server.clients[i].getUsername() == data['username']) {
                socket.emit('isUserConnectedResponse', response);
                return;
            }
        };
        response['isUserConnected'] = false;
        utils.logInfo('isUserConnected',"Checking if " + data['username'] + " is connected." + "Found " + response['isUserConnected']);
        socket.emit('isUserConnectedResponse', response);
        return;
    });


    socket.on('loginUser', function(data) {
        response = {
            'success': false
        };
        utils.logInfo('loginUser',"Logging in user: "  + data['username']);
        var new_client = new Client(data['username'], server, socket, session);
        new_client.setStatusToLoggedIn();
        response = {
            'success': true
        };
        socket.username = data['username'];
        socket.emit('loginUserResponse', response);
    });

    socket.on('logoutUser', function(data) {
        response = {
            'success': false
        };
        for (var i = server.clients.length - 1; i >= 0; i--) {
            if (server.clients[i].getUsername() == data['username']) {
                server.removeClient(server.clients[i]);
                response = {
                    'success': true
                };
                console.log(data['username'] + " has logged out successfully!");
                break;
            }
        };
        socket.emit('logoutUserResponse', response);
    });

    socket.on('getUsersOnline', function(data) {
        //todo: make sure it's valid user that has been authenticated
        var response = {
            'users': []
        }
        for (var i = server.clients.length - 1; i >= 0; i--) {
            response['users'].push({
                'username': server.clients[i].getUsername()
            });
        }
        socket.emit('getUsersOnlineResponse', response);
    });


    socket.on('getAllShareGroups', function(data) {
        //todo: make sure it's valid user that has been authenticated
        var response = {
            'shareGroups': []
        }
        for (i in shareGroups) {
            response['shareGroups'].push({
                'name': shareGroups[i].getShareGroupName(),
                'id': shareGroups[i].getShareGroupID()
            });
        }
        socket.emit('getAllShareGroupsResponse', response);
    });

    socket.on('updateFileWithShareGroup', function(data) {
        var response = [];
        var current_client = undefined;
        for (var i = server.clients.length - 1; i >= 0; i--) {
            if(server.clients[i].username == data['username']){
                current_client = server.clients[i];
            }        
        };

        if(current_client == undefined){
            console.log("User " + data['username'] +" disconnected!");
            return;
        }

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
        if (data['shareGroups']) {
            for (var j = data['shareGroups'].length - 1; j >= 0; j--) {
                if (shareGroups[data['shareGroups'][j]] != undefined) {
                    group = shareGroups[data['shareGroups'][j]];
                    file = new File(file.name, file.fileType, current_client, group);
                }
            };
        } else {
            file.client.removeFile(file);
            delete file;
        }

        socket.emit('updateFileWithShareGroupResponse', response);
    });


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
                    'name': shareGroups[i].getShareGroupName(),
                    'id': shareGroups[i].getShareGroupID()
                });
            }
        }
        socket.emit('getShareGroupsForFileResponse', response);
    });

    socket.on('getShareGroupsForUser', function(data) {
        var response = []
        var username = data.username;
        for (var i = server.clients.length - 1; i >= 0; i--) {
            if (server.clients[i].username == username) {
                for (var j = server.clients[i].shareGroupsThatIAmIn.length - 1; j >= 0; j--) {
                    var group = server.clients[i].shareGroupsThatIAmIn[j];
                    response.push({
                        'id': group.getShareGroupID(),
                        'name': group.getShareGroupName()
                    });
                };
            }
        };
        socket.emit('getShareGroupsForUserResponse', response)
    });

    socket.on('createShareGroup', function(data) {
        var s = new ShareGroup(data['name']);
        shareGroups[s.getShareGroupID()] = s;
        socket.emit('createShareGroupResponse', {
            'sucess': true,
            'id': s.getShareGroupID()
        });
    });

    socket.on('getFilesFromShareGroup', function(data) {
        var response = {
            'files': {}
        };
        var id = data['id'];
        var amount = data['amount'];
        var group = shareGroups[id];
        var c = 0;
        for (var i in group.files) {
            if (c == amount) {
                break;
            }
            f = group.files[i];
            response['files'][i] = {
                'name': f.getFileName(),
                'id': f.getFileID(),
                'user': f.client.username,
                'type': f.fileType,
                'shareGroup': {
                    'id': f.shareGroup.getShareGroupID(),
                    'name': f.shareGroup.getShareGroupName()
                }
            }
            c++; // Bjarne would be proud...jeeez
        }
        socket.emit('getFilesFromShareGroupResponse', response)
    });

    socket.on('getFilesFromUser', function(data) {
        var c;
        var files = [];
        for (var i = server.clients.length - 1; i >= 0; i--) {
            if (server.clients[i].getUsername() == data['username']) {
                c = server.clients[i];
                break;
            }
        };
        for (var item in c.files) {
            files.push({
                'name': c.files[item].getFileName(),
                'id': c.files[item].getFileID(),
                'shareGroup': {
                    'id': c.files[item].shareGroup.getShareGroupID(),
                    'name': c.files[item].shareGroup.getShareGroupName()
                }
            });
        }
        socket.emit('getFilesFromUserResponse', files)
    });
    socket.on('getStream', function(data) {
        var response = {
            'source': {},
            'destination': {},
            'file_id': {}
        };

        var file_id = data.file_id;
        var group_id = data.share_group_id;

        var requested_file = getFileByIDFromShareGroupID(group_id, file_id);
        console.log(requested_file);
        response.source = requested_file.client.username;
        response.destination = data.destination_username;
        response.file_id = file_id;

        message = "Connected stream for file:" + response.file_id + " with destination " + response.destination +" and source " + response.source;

        utils.logInfo("getStream","Data is " + JSON.stringify(data)+ ". Found that" + message)

        socket.emit('getStreamResponse', response);
    });



    socket.on('notifyServerOfClientsFiles', function(data) {
        var files = data['files'];
        var cur_user = undefined;
        for (var i = server.clients.length - 1; i >= 0; i--) {
            if(server.clients[i].username == data['username_to_add_to']){
                cur_user = server.clients[i];
            }
        };

        if(cur_user == undefined){
            console.log("attempted to add files to user " + data['username_to_add_to'] + " which does not exist anymore!");
            return;
        }


        for (var i = data['shareGroups'].length - 1; i >= 0; i--) {
            cur_user.addShareGroup(shareGroups[data['shareGroups'][i]]);
        };

        for (var i = files.length - 1; i >= 0; i--) {
            for (var j = data['shareGroups'].length - 1; j >= 0; j--) {
                if (shareGroups[data['shareGroups'][j]] != undefined) {
                    group = shareGroups[data['shareGroups'][j]];
                    var file = new File(files[i].name, files[i].type, cur_user, group)
                }
            };
        };
        file_info_to_return = [];
        for (var item in cur_user.files) {
            file_info_to_return.push({
                'name': cur_user.files[item].getFileName(),
                'id': cur_user.files[item].getFileID(),
                'shareGroup': {
                    'id': cur_user.files[item].shareGroup.getShareGroupID(),
                    'name': cur_user.files[item].shareGroup.getShareGroupName()
                }
            });
        }

        socket.emit('notifyServerOfClientsFilesResponse', file_info_to_return);
    })

    socket.on('notifySourceToStartStream', function(stream) {
        response = {
            "success": false,
            "message": ""
        };

        utils.logInfo("notifySourceToStartStream","Stream to start is " + JSON.stringify(stream))

        source_client = undefined;
        for (var i = server.clients.length - 1; i >= 0; i--) {
            if (server.clients[i].username == stream.source) {
                source_client = server.clients[i];
                break;
            }
        };
        if (source_client == undefined) {
            //Fail!!
            console.log("FAILED!");
            response['message'] = "Could not find source client. They may have disconnected.";
            socket.emit('notifySourceToStartStreamReponse', response)
        }

        source_client.socket.emit('startStreaming', {
            "file_id": stream.file_id,
            "destination": stream.destination,
            "download": stream.download
        });
        response['success'] = true;
        response['message'] = "Started stream";

        socket.emit('notifySourceToStartStreamReponse', response)
    });

    socket.on('getCurrentlySharedFiles', function(data) {
        var files = [];
        var cur_user = undefined
        console.log(data);
        for (var i = server.clients.length - 1; i >= 0; i--) {
            if(server.clients[i].username == data['username']){
                cur_user = server.clients[i];
            }
        };

        if(cur_user == undefined){
            console.log("User disconnected!");
            return;
        }


        for (var i in cur_user.files) {
            files.push({
                'name': cur_user.files[i].getFileName(),
                'id': cur_user.files[i].getFileID()
            });
        }
        socket.emit('getCurrentlySharedFilesResponse', files);
    });

    socket.on('addUsersToShareGroup', function(data) {
        var group = shareGroups[data['shareGroupID']];
        var users_added = [];
        for (var i = data['usernames'].length - 1; i >= 0; i--) {
            for (var j = server.clients.length - 1; j >= 0; j--) {
                if (server.clients[j].username == data['usernames'][i]) {
                    group.addClient(server.clients[j]);
                    users_added.push({
                        'username': server.clients[j].username
                    });
                }
            };
        };

        socket.emit('addUsersToShareGroupResponse', users_added);
    });



});


function getFileByIDFromShareGroupID(g_id, f_id) {
    var group = shareGroups[g_id];
    for (file in group.files) {
        if (file == f_id) {
            return group.files[file];
        }
    }
    return {};
}





var binaryServer = BinaryServer({
    port: 9000
});

// Wait for new user connections
binaryServer.on('connection', function(c) {
    // Incoming stream from browser
    c.on('stream', function(stream, meta) {
        // Supa hacks
        if (meta['username_get_socket'] != undefined) {
            for (var i = server.clients.length - 1; i >= 0; i--) {
                if(server.clients[i].username == meta['username_get_socket']){
                    server.clients[i].binarySocket = c;
                    console.log(server.clients[i].username +" had their binarySocket set.");
                    break;
                }
            };
        } else {

            var destination = meta.destination;

            var client_object_destination = {};

            for (var i = server.clients.length - 1; i >= 0; i--) {
                if (server.clients[i].username == destination) {
                    client_object_destination = server.clients[i];
                }
            };

            client_object_destination.binarySocket.send(stream, meta);

            stream.on('data', function(data) {
                stream.write({
                    rx: data.length / meta.size
                });
            });
        }
    });



});


http.listen(3000, function() {
    console.log('listening on *:3000');
});