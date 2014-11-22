/**
 * Creates a new ShareGroup.
 * @class
 */

var ShareGroup = function ShareGroup() {
	this.files = [];
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

/**
* Add a file to be shared with all clients.
* @param {File} client The file to be shared with all clients.
*/
ShareGroup.prototype.addFile = function (file) {
	this.files.push(file);
	this.numberOfFiles++;
};

 module.exports = ShareGroup;				// this line is so that this class can be accessed by other files