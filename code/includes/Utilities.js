var Utilities = function Utilities(){

}

u = Utilities.prototype;

u.generateRandomKey = function (){
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
		})()();
}





 module.exports = Utilities;				// this line is so that this class can be accessed by other files