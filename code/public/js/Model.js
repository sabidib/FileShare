var Model = function Model(socket, binarySocket){	
	this.socket = socket;
	this.binarySocket = binarySocket;
	this.listenerArray = [];
}

m = Model.prototype;


m.setCallback = function(serverResponseName,callback){
	//We remove any of the socket listeners that exist with the same name
	//so that we don't have multiple listeners with different callbacks
	this.socket.removeAllListeners(serverResponseName);
	//We add a socket listener
	this.socket.on(serverResponseName,callback);
}



m.isUserConnected = function(username,callback){
	this.setCallback('isUserConnectedResponse',callback);
	this.socket.emit('isUserConnected',{'username' : username});
}

m.loginUser = function(username,callback){
	this.setCallback('loginUserResponse',callback);
	this.socket.emit('loginUser',{'username' : username});
}





