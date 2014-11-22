/**
 * Creates a new ShareGroup.
 * @class
 */

var ShareGroup = function ShareGroup(name) {
	this.files = [];
	this.name = name;
	this.clients = [];
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

ShareGroup.prototype.getShareGroupID = function() {
	return this.shareGroupID;
}
ShareGroup.prototype.getShareGroupName = function(){
	return this.name;
}

ShareGroup.prototype.addFile = function(file){
	if(this.files[file.getFileID()] == undefined){
		this.files[file.getFileID()] = file;
		return true;
	}  else {
		return false;
	}
}

/**
* Add a client to the clients list.
* 
* @param {Client} client The client to be added to the clients list.
*/
ShareGroup.prototype.addClient = function (aClient) {
    var wasAdded = false;
    for(var  i=0; i < this.clients.length;i++){
    	if(this.clients[i].getUsername() == aClient.getUsername()){
    		return false;
    	}
    }
	this.clients.push(aClient);
	aClient.addShareGroup(this);
};

ShareGroup.prototype.getNumberOfClients = function(){
	return this.clients.length;
}
ShareGroup.prototype.getNumberOfFiles = function(){
	return this.files.length;
}

 module.exports = ShareGroup;				// this line is so that this class can be accessed by other files