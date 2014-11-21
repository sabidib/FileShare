
var Controller = function Controller(){
	
	model = new Model();
	view = new View();
	this.addListeners();
}

Controller.prototype.addListeners = function(){
	controller = this;	
	$('#id').on('click','body',function(e){
		controller.setSessionID(e.val())
		if(model.isValidSessionID(controller.getSessionID())){
			view.loadMainPage(model.getName());
		}
	});

	
	$('.getFile').on('click',function(e){
		file_object = model.getFileObject(e.info)
		strm_req = new StreamRequest(file_object);
		stream = model.getStream(strm_reqm);
		if(stream.doesHaveAcces()){
			controller.startStream(stream);
		}
	})

	$('#add-files').on('click', function(e) {		
		e.preventDefault();
		$('#add-files-dialog').click();
		var files = $('#add-files-dialog').val();
		console.log(files);
	})

}

Controller.prototype.setSessionID = function(sessionID){
	this.sessionID = sessionID; 
}

Controller.prototype.getSessionID = function(){
	return sessionID;
}