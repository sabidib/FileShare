/**
 * Creates a new ShareGroup.
 * @class
 */

var ShareGroup = function ShareGroup(name) {
	this.files = {};
	this.clients = {};
	this.name = name;	
	this.numberOfClients = 0;
	this.numberOfFiles = 0;
	this.shareGroupID = this.getNewShareGroupIDFromServer();
};

ShareGroup.GlobalShareGroupIDCounter = 0;

ShareGroup.prototype.getNewShareGroupIDFromServer = function(){
	console.log("Creating a new ShareGroup, printing from getNewShareGroupIDFromServer. This function must get a new unique shareGroupID from the server.")
	var tmp = ShareGroup.GlobalShareGroupIDCounter;
	ShareGroup.GlobalShareGroupIDCounter++;
	return tmp;
}

ShareGroup.prototype.removeFile = function(file){
	this.files[file.id] = null;
	delete this.files[file.id];
}

ShareGroup.prototype.addFile = function(file){
	if(file.id in this.files) {
		return false;		
	}  else {
		this.files[file.id] = file;
		return true;
	}
}

ShareGroup.prototype.addClient = function (client) {
     if (client.username in this.clients) {
        return false;
    }
    else {
        this.clients[client.username] = client;           
        client.addShareGroup(this);
        return true;
    }	
};

ShareGroup.prototype.removeClient = function(client){
    if (client.username in this.clients) {    	
    	for(var j in this.files){
    		if(this.files[j].client.username == client.username){
    			console.log("Removing file " + this.files[j].name)
    			delete this.files[j];
    		} 
    	}
    	client.removeShareGroup(this);
    	return true;
    }
    return false;    	    
}

ShareGroup.prototype.getNumberOfClients = function(){
	return this.clients.length;
}
ShareGroup.prototype.getNumberOfFiles = function(){
	return this.files.length;
}

 module.exports = ShareGroup;				// this line is so that this class can be accessed by other files