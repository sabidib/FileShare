/**
 * Creates a new ShareGroup.
 * @class
 */
var ShareGroup = function ShareGroup() {
	this.files = [];
	this.clients = [];
	this.numberOfClients = 0;
	this.numberOfFiles = 0;
};


/**
* Add a client to the clients list.
* @param {Client} client The client to be added to the clients list.
*/
ShareGroup.prototype.addClient = function (client) {
	this.clients.push(client);
	this.numberOfClients++;
};

/**
* Add a file to be shared with all clients.
* @param {File} client The file to be shared with all clients.
*/
ShareGroup.prototype.addFile = function (file) {
	this.files.push(file);
	this.numberOfFiles++;
};

 module.exports = ShareGroup;				// this line is so that this class can be accessed by other files