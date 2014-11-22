var Utilities = require('./Utilities.js');


var Session = function Session(cookieParser,cookieSession){
	this.utils = new Utilities();
	this.sessionID = this.utils.generateRandomKey();
	this.cookieParser = cookieParser;
	this.cookieSession = cookieSession;
	this.table = {};
}

Session.prototype.constructor = Session;

Session.prototype.getSessionID = function(){
	return this.sessionID;
}


Session.prototype.set = function(key,value){
	this.table['key'] = value;
}



module.exports = Session;				// this line is so that this class can be accessed by other files