var ShareGroup = require('./ShareGroup.js');
var Server = require('./Server.js');
var Session = require('./Session.js');
/**
 * The client object represents a client.
 * It contains all the information related to the client.
 */

/**
 * Client class.
 * Takes a username that will be stored in the server, as well as a socket and a session.
 */ 

var Client = function Client(username,server,socket,session){
	this.server = server;
	this.username = username;
	this.loginTime = new Date();	
	this.shareGroupsThatIAmIn = [];
	this.socket = socket;
	this.session = session;
	this.server.addClient(this);
	this.addShareGroup(globalShareGroup);	
	this.files = {};	
	this.binarySocket = null;
}

Client.prototype.constructor = Client;			// set constructor

// Add a file to the client's file list if it doesn't already exist
Client.prototype.addFile = function(file){
	if(file.id in this.files){		
		return false;
	}  else {
		this.files[file.id] = file;
		return true;
	}

}

// Remove a file from the client's file list
Client.prototype.removeFile = function(file){
	this.files[file.id] = null;
	delete this.files[file.id];
}

// Add this client to a share group
Client.prototype.addShareGroup = function(shareGroup) {
	var wasAdded = false;
	for (var i = this.shareGroupsThatIAmIn.length - 1; i >= 0; i--) {
		if(this.shareGroupsThatIAmIn[i].shareGroupID == shareGroup.shareGroupID){
			return false;
		}
	};
	this.shareGroupsThatIAmIn.push(shareGroup);
	shareGroup.addClient(this);
	return true;
};

// Remove this client from a share group
Client.prototype.removeShareGroup = function(shareGroup){
	for (var i = this.shareGroupsThatIAmIn.length - 1; i >= 0; i--) {
		if(this.shareGroupsThatIAmIn[i].shareGroupID == shareGroup.shareGroupID){
			console.log("removing share group" + this.shareGroupsThatIAmIn[i].name);
    		this.shareGroupsThatIAmIn.splice(i,1);
			shareGroup.removeClient(this);
			return true;
		}
	};
	return false;

}

// Remove this client from all share groups
Client.prototype.disconnectAllShareGroups = function(){
	for (var i = this.shareGroupsThatIAmIn.length - 1; i >= 0; i--) {
		this.removeShareGroup(this.shareGroupsThatIAmIn[i]);
	};
}

// Remove all files uploaded by this client
Client.prototype.removeAllFiles = function(){
	for(var i in this.files){
		this.files[i].deleteFile();
	}
	this.files = {};
}

// Updates the server this client is on
Client.prototype.setServer = function(server){
	this.server = server;
	return true;
};

Client.prototype.setStatusToLoggedIn = function(){
	this.session.set('loggedIn',true);
}

Client.prototype.setStatusToLoggedOut = function(){
	this.session.set('loggedIn',false);
}




module.exports = Client;				// this line is so that this class can be accessed by other files



