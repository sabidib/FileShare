var NetworkFileSystemNode = require('./NetworkFileSystemNode.js');
var ShareGroup = require('./ShareGroup.js');
var Server = require('./Server.js');
var Session = require('./Session.js');




var Client = function Client(username,server,socket,session){
	this.server = server;
	this.username = username;
	this.loginTime = new Date();
	this.numberOfFilesStreamed = 0;
	this.numberOfFilesStreaming = 0;
	this.shareGroupsThatIAmIn = [];
	this.socket = socket;
	this.session = session;
	this.server.addClient(this);
	this.addShareGroup(globalShareGroup);	
	this.files = {};	
	this.binarySocket = null;
}



Client.prototype.constructor = Client;


Client.prototype.addFile = function(file){
	if(file.id in this.files){		
		return false;
	}  else {
		this.files[file.id] = file;
		return true;
	}

}

Client.prototype.removeFile = function(file){
	this.files[file.id] = null;
	delete this.files[file.id];
}


Client.prototype.setSocket = function(socket){
	this.socket = socket;
}

Client.prototype.getSocket = function(){
	return this.socket;
}

Client.prototype.getUsername = function(){
	return this.username;
}

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

Client.prototype.disconnectAllShareGroups = function(){
	for (var i = this.shareGroupsThatIAmIn.length - 1; i >= 0; i--) {
		this.removeShareGroup(this.shareGroupsThatIAmIn[i]);
	};
}

Client.prototype.removeAllFiles = function(){
	for(var i in this.files){
		this.files[i].deleteFile();
	}
	this.files = {};
}

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



