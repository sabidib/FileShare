
var StreamRequest = function StreamRequest(request_source_username,file_id){
	this.file_id = file_id
	this.request_source_username = request_source_username;
}


StreamRequest.prototype.getFileID = function(){
	return this.file_id;
}

