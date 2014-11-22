
var Controller = function Controller(){
	
	model = new Model();
	view = new View();	
	//view.showLoginPage()
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

	// This listener pops up a file dialog and allows the user to select files to be shared. After selection,
	// the user presses OK or Enter and the files selected/about to be shared are shown.
	// Then a list of all users is retrieved from the server and shown to the current user for selection (who
	// the files are to be shared with).
	$('#share-button').on('click', function(e) {				
		e.preventDefault();
		$('#add-files-dialog').click();
		$('#add-files-dialog').change(function() {
			var files = $('#add-files-dialog')[0].files;
			view.showFilesAboutToBeShared(files);
		});				
		//var users = model.getClients();
		//view.showPickUsers(users);		
	});

	$('#about-to-share').bind("DOMSubtreeModified", function(e) {		
		$('html, body').animate({
        	scrollTop: $("#about-to-share").offset().top
    	}, 2000);
	})


}

Controller.prototype.setSessionID = function(sessionID){
	this.sessionID = sessionID; 
}

Controller.prototype.getSessionID = function(){
	return sessionID;
}