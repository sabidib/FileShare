/**
 * The StreamRequest class is used when the user would like to stream a
 * file, but only has the file_id.
 * 
 * Once the object is constructed the user can send this request to
 *  the server which will respond with
 * the arguments to instantiate an object of the Stream class. 
 */



var StreamRequest = function StreamRequest(request_source_username,file_id){
	this.file_id = file_id
	this.request_source_username = request_source_username;
}


StreamRequest.prototype.getFileID = function(){
	return this.file_id;
}

