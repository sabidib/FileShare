
/**
 * This is an abstract class called NetworkFileSystemNode.
 * @class
 * @abstract
 * @param {string} name The name of the file.
 * @param {string} path The path of the file.
 * @param {string} location The path of the folder.
 */

var NetworkFileSystemNode = function NetworkFileSystemNode(name, path, location) {
	 if (this.constructor === NetworkFileSystemNode) {
      throw new Error("Can't instantiate abstract class!");						// throw error if trying to instantiate
    }
	this.name = name;
	this.path = path;
	this.location = location;
	if (!location) {
		throw "No location provided, cannot create NetworkFileSystemNode.";
	}
	this.parents = [];
	this.children = [];
}

module.exports = NetworkFileSystemNode;				// this line is so that this class can be accessed by other files