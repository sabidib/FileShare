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
	this.files = []
}



Client.prototype.constructor = Client;


Client.prototype.addFile = function(file){
	if(this.files[file.getFileID()] == undefined){
		this.files[file.getFileID()] = file;
		return true;
	}  else {
		return false;
	}

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
	this.shareGroupsThatIAmIn.push(this);
	shareGroup.addClient(this);
	return true;
};

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



