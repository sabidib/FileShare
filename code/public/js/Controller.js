


var Controller = function Controller(hostname,port){
	
	this.binarySocket = {};
	this.socket = {};

	this.setupSocketIO();
	this.setupBinary(hostname,port);

	model = new Model(this.socket,this.binarySocket);
	view = new View();	

	fileSelectionModal = new FileSelectionModal(model);
	

	//view.showLoginPage()
	this.addListeners();
}

ctrl = Controller.prototype;


ctrl.setupSocketIO = function(){
    this.socket = io();    
    this.socket.on('omg',function(data){
    	console.log('omg!' + data);
    })
}

ctrl.setupBinary = function(hostname,port){
    this.binarySocket = new BinaryClient('ws://'+hostname+':'+port);
}

ctrl.addListeners = function(){
	controller = this;	

	$('body').on('click','#signInButton',function(e){
		e.preventDefault();
		username = $('#inputUsername').val();
		if(username == ""){
			view.showEmptyUsernameLoginAttempt();
			return;
		} 


		model.isUserConnected(username,function(data){
			console.log(data);
			if(!data['isUserConnected']){
				model.loginUser(username,function(data){
					if(data['success']){
						view.showMainPage(username);				
					} else {
						view.showLoginFailure();
					}
				});
			} else {
				view.showUsernameAlreadyBeingUsed();
			}
		});
	});


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
			fileSelectionModal.getShareGroupsToShareWith(files,function(data){
				toSend = {'files' : files, 'shareGroups' : data['shareGroups']};
				files = model.notifyServerOfClientsFiles(toSend,function(data){
					console.log('received : ')
					console.log(data);
				});
			})

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




ctrl.handleSendingFile = function(){
    var box = $('#box');
    box.on('dragenter', doNothing);
    box.on('dragover', doNothing);
    box.text('Drag files here');
    box.on('drop', function(e){
        e.originalEvent.preventDefault();                    
        var file = e.originalEvent.dataTransfer.files[0];                    
        // Add to list of uploaded files
        $('<div align="center"></div>').append($('<a></a>').text(file.name).prop('href', '/'+file.name)).appendTo('body');
            
            // `client.send` is a helper function that creates a stream with the 
            // given metadata, and then chunks up and streams the data.
            var filePath = "/"; // need to somehow get file path
            var stream = client.send(file, {name: file.name, size: file.size, type:file.type, path:filePath});
            
            // Print progress
            var tx = 0;
            stream.on('data', function(data){
            $('#progress').text(Math.round(tx+=data.rx*100) + '% complete');
         });
      }); 
}


ctrl.setupBinaryListeners = function(){
	this.binarySocket.on('open',this.handleSendingFile)
	this.binarySocket.on('stream',this.receiveStreamFromServer)
}


ctrl.receiveStreamFromServer = function(stream,meta){
	  // Buffer for parts
	  var parts = [];
	  // Got new data
	  stream.on('data', function(data){            
	    parts.push(data);
	  });
	  stream.on('end', function(){
	    // Display new data in browser!
	    var img = document.createElement("img");
	    img.src = (window.URL || window.webkitURL).createObjectURL(new Blob(parts));
	    document.body.appendChild(img);

	    var audioElement = document.createElement('audio');
	    audioElement.setAttribute('src',(window.URL || window.webkitURL).createObjectURL(new Blob(parts)));
	    audioElement.setAttribute('type','audio/mpeg');
	    audioElement.play();
	  });
}





ctrl.setSessionID = function(sessionID){
	this.sessionID = sessionID; 
}

ctrl.getSessionID = function(){
	return sessionID;
}