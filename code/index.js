var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);
var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');

var File = require('./includes/File.js'); // testing File class
var ShareGroup = require('./includes/ShareGroup.js'); // testing ShareGroup class

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(path.resolve('public/html/index.html'));
});


io.on('connection', function(socket){
	console.log("user connected!");  


	var rooms = socket.rooms;

	fs.readFile(__dirname+'/public/img/', function(err, buf){
	    // it's possible to embed binary data
	    // within arbitrarily-complex objects
    	socket.emit('image', { image: true, buffer: buf });
  	
  	});


    socket.on('user connected',function(msg){
      console.log("someone connected!");      
    })




});




var server = BinaryServer({port: 9000});

// Wait for new user connections
server.on('connection', function(client){
  	  // Incoming stream from browsers
  client.on('stream', function(stream, meta){
    var shareGroup = new ShareGroup();
    var file = new File(meta.name, meta.path, meta.path, meta.type, client);
    shareGroup.addFile(file);
    shareGroup.addClient(client);    
    stream.on('data', function(data){
      stream.write({rx: data.length / meta.size});
    });
    //
  });


});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
