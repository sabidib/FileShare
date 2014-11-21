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
var File = function File(name, path, location, fileType, client, shareGroup) {
	NetworkFileSystemNode.call(this, name, path, location);	
	this.fileType = fileType;
	this.client = client;
	if (shareGroup) {
		shareGroup.addFile(this);
		this.shareGroup = shareGroup;	
	}	
}

File.prototype = Object.create(NetworkFileSystemNode.prototype); 		// inherit from NetworkFileSystemNode
File.prototype.constructor = File;					// change constructor from NetworkFileSystemNode's constructor to File's constructor

/**
* Set the shareGroup for this file and add it as a client.
* @param {ShareGroup} shareGroup The group this file is to be shared with.
*/
File.prototype.setShareGroup = function(shareGroup) {
	shareGroup.addFile(this);
	this.shareGroup = shareGroup;
}


module.exports = File;				// this line is so that this class can be accessed by other files