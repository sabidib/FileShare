/**
 * Creates a new ShareGroup.
 * @class
 * @param {File} file The file object that this ShareGroup is for. 
 */
var ShareGroup = function ShareGroup(file) {
	this.file = file;	
	this.clients = [];
	this.numberOfClients = 0;
};


/**
* Add a client to the clients list.
* @param {Client} client The client to be added to the clients list.
*/
ShareGroup.prototype.addClient = function (client) {
	this.clients.push(client);
	this.numberOfClients++;
};

 module.exports = ShareGroup;				// this line is so that this class can be accessed by other files