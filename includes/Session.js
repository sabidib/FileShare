var Utilities = require('./Utilities.js');

/**
 * Session class that stores Client's information.
 */ 
var Session = function Session(cookieParser,cookieSession){
	this.utils = new Utilities();
	this.sessionID = this.utils.generateRandomKey();
	this.cookieParser = cookieParser;
	this.cookieSession = cookieSession;
	this.table = {};
}

Session.prototype.constructor = Session;				// set constructor


// Add additional properties to the session
Session.prototype.set = function(key,value){
	this.table['key'] = value;
}



module.exports = Session;				// this line is so that this class can be accessed by other files