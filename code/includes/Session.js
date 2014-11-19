
var Session = function Session(){
	this.key = this.generateRandomKey();
}

Session.prototype.constructor = Session;

Session.prototype.getSessionID = function(){
	return this.key;
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



module.exports = Session;				// this line is so that this class can be accessed by other files