var NetworkFileSystemNode = require('./NetworkFileSystemNode.js');
var ShareGroup = require('./ShareGroup.js');
/**
 * Creates a new File.
 * @class
 * @param {string} name The name of the file.
 * @param {string} path The path of the file.
 * @param {string} location The path of the folder.
 * @param {string} fileType The file type of this file.
 * @param {Client} Client The client that has this file.
 */
var File = function File(name, path, location, fileType, client) {
	NetworkFileSystemNode.call(this, name, path, location);	
	this.fileType = fileType;
	this.client = client;
	this.shareGroup = new ShareGroup(this);	
}

File.prototype = Object.create(NetworkFileSystemNode.prototype); 		// inherit from NetworkFileSystemNode
File.prototype.constructor = File;					// change constructor from NetworkFileSystemNode's constructor to File's constructor

/**
* Add a client to the ShareGroup for this file.
* @param {Client} client The client to add to the ShareGroup;
*/
File.prototype.addToShareGroup = function(client) {
	this.shareGroup.addClient(client);	
}


module.exports = File;				// this line is so that this class can be accessed by other files