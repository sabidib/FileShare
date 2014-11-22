
var Session = function Session(cookieParser,cookieSession){
	this.sessionID = this.generateRandomKey()();
	this.cookieParser = cookieParser;
	this.cookieSession = cookieSession;
	this.table = {};
}

Session.prototype.constructor = Session;

Session.prototype.getSessionID = function(){
	return this.sessionID;
}

Session.prototype.generateRandomKey = function(){
	return (function() {
		  function s4() {
		    return Math.floor((1 + Math.random()) * 0x10000)
		               .toString(16)
		               .substring(1);
		  }
		  return function() {
		    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		           s4() + '-' + s4() + s4() + s4();
		  };
		})();
}

Session.prototype.set = function(key,value){
	this.table['key'] = value;
}



module.exports = Session;				// this line is so that this class can be accessed by other files