var NetworkFileSystemNode = require('./NetworkFileSystemNode.js');
var Client = require('./Client.js');

/**
 * The main Server class. This is a singleton as only one instance of this is created whenever the app is started.
 */ 
var Server = function Server(){
	this.clients = {};        
	this.startTime = new Date();	
}


Server.prototype.constructor = Server;          // Set the constructor

// Check if client is logged into server
Server.prototype.userExists = function(username) {
    return (username in this.clients);
};


// Add client to a list of logged in clients
Server.prototype.addClient = function(client) {
    if (client.username in this.clients) {
        return false;
    }
    else {
        this.clients[client.username] = client;        
        client.setServer(this);
        return true;
    }
};

// Remove client from server
Server.prototype.removeClient = function(client){
    if (client.username in this.clients) {
        this.clients[client.username] = null;      
        delete this.clients[client.username];
        return true;        
    }
    return false;
}

// Find client by username and remove it
Server.prototype.removeClientByUser = function(username){
    if (username in this.clients) {        
        this.clients[username] = null;                
        delete this.clients[username];
        return true;        
    }
    return false;
}


module.exports = Server;				// this line is so that this class can be accessed by other files
