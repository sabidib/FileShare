/**
 * Creates a new ShareGroup.
 */

var ShareGroup = function ShareGroup(name) {
	this.files = {};
	this.clients = {};
	this.name = name;		
	this.shareGroupID = this.getNewShareGroupIDFromServer();
};

// Each share group has a unique ID
ShareGroup.GlobalShareGroupIDCounter = 0;

// Generate unique ID
ShareGroup.prototype.getNewShareGroupIDFromServer = function(){
	console.log("Creating a new ShareGroup, printing from getNewShareGroupIDFromServer. This function must get a new unique shareGroupID from the server.")
	var tmp = ShareGroup.GlobalShareGroupIDCounter;
	ShareGroup.GlobalShareGroupIDCounter++;
	return tmp;
}

// Remove file from share group
ShareGroup.prototype.removeFile = function(file){
	this.files[file.id] = null;
	delete this.files[file.id];
}


// Add file to this share group if it isn't already in it
ShareGroup.prototype.addFile = function(file){
	if(file.id in this.files) {
		return false;		
	}  else {
		this.files[file.id] = file;
		return true;
	}
}

// Add a client to this share group if it isn't already in it
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

// Remove client from this group
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

 module.exports = ShareGroup;				// this line is so that this class can be accessed by other files