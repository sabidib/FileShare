var Utilities = require('./Utilities.js');
var ShareGroup = require('./ShareGroup.js');
/**
 * Creates a new File.
 */ 
var File = function File(name, fileType, client, shareGroup) {	
	this.utils = new Utilities();
	this.fileType = fileType;
	this.client = client;
	this.id = require('crypto').createHash('md5').update(name).digest("hex");
	this.name = name;

	// Add this file to the share group and client
	client.addFile(this);
	if (shareGroup) {
		shareGroup.addFile(this);
		this.shareGroup = shareGroup;	
	}	
}

// Set Constructor
File.prototype.constructor = File;


// Delete a file from the system
File.prototype.deleteFile = function(){
	this.shareGroup.removeFile(this);
	this.client.removeFile(this);
}



module.exports = File;				// this line is so that this class can be accessed by other files