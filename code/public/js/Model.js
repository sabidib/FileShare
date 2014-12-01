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
											setTimeout(function() {md.binarySocket.send("file",{'username_get_socket' : username})}, 400);
										});
	this.socket.emit('loginUser',{'username' : username});	

}

m.logoutUser = function(username,callback){		
	this.setCallback('logoutUserResponse', callback);	
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

m.getShareGroupsForUser = function(username,callback){
	name = 'getShareGroupsForUser';
	this.setCallback(name+'Response',callback);
	this.socket.emit(name,{'username' : username});
}


m.notifyServerOfClientsFiles = function(data,callback){
	this.setCallback('notifyServerOfClientsFilesResponse',callback);
	this.socket.emit('notifyServerOfClientsFiles',data);		
}

m.getBrowsableFilesForUser = function(data,callback){
	this.setCallback('getBrowsableFilesForUserResponse',callback);
	this.socket.emit('getBrowsableFilesForUser',data);	
}

m.getFilesFromUser = function(username,callback){
	this.setCallback('getFilesFromUserResponse',callback);
	this.socket.emit('getFilesFromUser',{'username': username});	
}

m.updateFileWithShareGroup = function(data,callback){
	this.setCallback('updateFileWithShareGroupResponse',callback);
	this.socket.emit('updateFileWithShareGroup',data);	

}

m.getShareGroupsForFile = function(data,callback){
	this.setCallback('getShareGroupsForFileResponse',callback);
	this.socket.emit('getShareGroupsForFile',data);	

}

m.getStream = function(data,callback){
	this.setCallback('getStreamResponse',callback);
	this.socket.emit('getStream',{'file_id' : data.request.file_id , 
									'destination_username' : data.request.request_source_username , 
									'share_group_id' : data.share_group_id
								});	
}


m.notifySourceToStartStream = function(stream,callback){
	this.setCallback('notifySourceToStartStreamResponse',callback);
	this.socket.emit('notifySourceToStartStream',stream);	
}


m.getCurrentlySharedFiles = function(username,callback){
	this.setCallback('getCurrentlySharedFilesResponse',callback);
	this.socket.emit('getCurrentlySharedFiles',{'username' : username});	

}

m.createShareGroup = function(name,callback){
	this.setCallback('createShareGroupResponse',callback);
	this.socket.emit('createShareGroup',{'name': name});	
}

m.addUsersToShareGroup = function(usernames,shareGroupID,callback){
	this.setCallback('addUsersToShareGroupResponse',callback);
	this.socket.emit('addUsersToShareGroup',{'usernames' : usernames , 'shareGroupID' : shareGroupID});	

}

