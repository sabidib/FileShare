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
	//We add the socket listener
	this.socket.on(serverResponseName,callback);
}



m.isUserConnected = function(username,callback){
	this.setCallback('isUserConnectedResponse',callback);
	this.socket.emit('isUserConnected',{'username' : username});
}

m.loginUser = function(username,callback){
	var md = this;
	this.setCallback('loginUserResponse',function(data){
										callback(data);
										md.binarySocket.send("file",{'soMuchHacksWeNeedBinarySocketClientAssociatedWithClient' : true});
									});
	this.socket.emit('loginUser',{'username' : username});
}

m.logoutUser = function(username,callback){		
	this.setCallback('logoutUserResponse', function(data){ callback(data); });	
	this.socket.emit('logoutUser',{'username' : username});	
}

m.getUsersOnline = function(callback){
	this.setCallback('getUsersOnlineResponse',callback);
	this.socket.emit('getUsersOnline');
}

m.getAllShareGroups = function(callback){
	this.setCallback('getAllShareGroupsResponse',callback);
	this.socket.emit('getAllShareGroups');	
}

m.notifyServerOfClientsFiles = function(data,callback){
	this.setCallback('notifyServerOfClientsFilesResponse',callback);
	this.socket.emit('notifyServerOfClientsFiles',data);		
}


m.getFilesFromShareGroup = function(data,callback){
	this.setCallback('getFilesFromShareGroupResponse',callback);
	this.socket.emit('getFilesFromShareGroup',data);	

}

m.getStream = function(data,callback){
	this.setCallback('getStreamResponse',callback);
	this.socket.emit('getStream',{'file_id' : data.request.file_id , 'share_group_id' : data.share_group_id});	
}


m.notifySourceToStartStream = function(stream,callback){
	this.setCallback('notifySourceToStartStreamResponse',callback);
	this.socket.emit('notifySourceToStartStream',stream);	
}


m.getCurrentlySharedFiles = function(callback){
	this.setCallback('getCurrentlySharedFilesResponse',callback);
	this.socket.emit('getCurrentlySharedFiles');	

}