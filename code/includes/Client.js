var NetworkFileSystemNode = require('./NetworkFileSystemNode.js');
var ShareGroup = require('./ShareGroup.js');
var Server = require('./Server.js');
var Session = require('./Session.js');




var Client = function Client(username,server,socket){
	this.server = server;
	this.username = username;
	this.loginTime = new Date();
	this.numberOfFilesStreamed = 0;
	this.numberOfFilesStreaming = 0;
	this.session = new Session();
	this.shareGroupsThatIAmIn = [];
	this.socket = socket;
	this.server.addClient(this);
}



Client.prototype.constructor = Client;

Client.prototype.setSocket = function(socket){
	this.socket = socket;
}

Client.prototype.getSocket = function(){
	return this.socket;
}


Client.prototype.setSessionID = function(sessionID){
	this.sessionID = sessionID; 
}

Client.prototype.getSessionID = function(){
	return sessionID;
}

Client.prototype.getUsername = function(){
	return this.username;
}

Client.prototype.addShareGroup = function(shareGroup) {
	console.log("IMPLEMENTATION: Client.addShareGroup is not implemented...returning true.");
	return true;
};

Client.prototype.setServer = function(server){
	this.server = server;
	return true;
};




module.exports = Client;				// this line is so that this class can be accessed by other files



