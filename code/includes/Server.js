var NetworkFileSystemNode = require('./NetworkFileSystemNode.js');
var Client = require('./Client.js');


var Server = function Server(){
	this.clients = [];
	this.startTime = new Date();
	this.numberOfFilesStreamed = 0;
	this.numberOfFilesStreaming = 0;
	this.sessions = [];
}


Server.prototype.constructor = Server;


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
    		this.clients[i].setServer({});
    		this.clients.splice(i,1);
    		return true;
    	}
    }
    return false;
}
module.exports = Server;				// this line is so that this class can be accessed by other files
