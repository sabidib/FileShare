var NetworkFileSystemNode = require('./NetworkFileSystemNode.js');
var NetworkNode = require('./NetworkNode.js')
var Client = require('./Client.js');
var Session = require('./Session.js');


var Server = function Server(){
	NetworkNode.call(this);	
	this.clients = [];
	this.startTime = new Date();
	this.numberOfFilesStreamed = 0;
	this.numberOfFilesStreaming = 0;
	this.sessions = [];
}

Server.prototype.getFileFromID(id){
	return files(id)
}

Server.prototype.constructor = Server;

Server.prototype = Object.create(NetworkNode.prototype); 		// inherit from NetworkFileSystemNode

Server.prototype.validateLogin = function(username,password){
	if(username == "admin" && password == "admin" || username == "admin2" && password == "admin"){
		return true;
	} else {
		return false;
	}
}



Server.prototype.addSession = function(session){
	if(session instanceof Session){
		this.sessions.push(session);
		return true;
	} 
	return false;
}

Server.prototype.addClient = function(client) {

    var wasAdded = false;
    for(var  i=0; i < this.clients.length;i++){
    	if(this.clients[i].getUsername() == client.getUsername()){
    		return false;
    	}
    }
    this.clients.push(client);
    wasAdded = true;
    
	client.setServer(this);

    return wasAdded;
};

Server.prototype.removeClient = function(client){
    for(var  i=0; i < this.clients.length;i++){
    	if(this.clients[i].getUsername() == client.getUsername()){
    		this.clients.splice(i,1);
    		return true;
    	}
    }
    return false;
}
module.exports = Server;				// this line is so that this class can be accessed by other files
