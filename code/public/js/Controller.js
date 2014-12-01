/**
 * The controller is the "main" method of the program.
 *
 * It handles the listeners of the main window buttons 
 * as well as the sockets and global list of files being shared.
 *
 * It routes events to their appropriate functions, incluing also handles
 * the login and streaming of files. 
 */


var Controller = function Controller(hostname,port){

 	this.hostname = hostname;
 	this.port = port;
	//We initialize the binary socket that will handle
	//the streaming of files
	this.binarySocket = {};
	//We inialize the main socket that will handle our server
	//calls
	this.socket = {};

	this.setupSocketIO();
	this.setupBinary(hostname,port);


	//The current username being served
	this.current_username = "";

	//Create our model
	model = new Model(this.socket,this.binarySocket);
	//Create the view
	view = new View();

	this.model =model;
	this.view = view;


	//Create our UI elements
	//Placement of the elements can be found in Index.html
	this.fileSelectionModal = new ShareGroupModal(this.model,this.view);
	this.shareGroupCreationModal = new ShareGroupCreationModal(this.model,this.view);

	//The list of files that are currently being shared
	//Due to browser restrictions, we need to keep the COMPLETE
	//file data in memory. Hence we limit the max file size to 150mb
	this.files_currently_sharing = [];

	//Check if the user has visited before 
	//with a username
	this.handleLogin();

	this.addListeners();
}

ctrl = Controller.prototype;


ctrl.handleLogin = function(){
	username = localStorage.getItem('username');
	if(username != "" && username != undefined){
		this.loginUsername(username);
		view.showMainPage(username)
	} else {
		view.showMainPage();
	}
}

ctrl.setupSocketIO = function(){
    this.socket = io();    
    this.setSocketIOListeners();
}

ctrl.setupBinary = function(hostname,port){
    this.binarySocket = new BinaryClient('ws://'+hostname+':'+port);
	this.setupBinaryListeners();
}

ctrl.setCurrentUsername = function(username){
	this.current_username = username;
}

/**
 * Given a username we inform the server that this username has now logged in.
 * If another is already using that username, then a login failure is thrown.
 * @param  {[String]} username [The username to log in]
 * @return {[void]}          
 */
ctrl.loginUsername = function(username){
	controller = this;	
	controller.model.isUserConnected(username,function(data){
		if(!data['isUserConnected']){
			controller.model.loginUser(username,function(data){
				if(data['success']){
					view.showMainPage(username);	
					localStorage.setItem('username', username);
					controller.setCurrentUsername(username);
				} else {
					view.showLoginFailure();
				}
			});
		} else {
			view.showUsernameAlreadyBeingUsed();
		}
	});

}

/**
 * General listeners for buttons on the main page.
 */
ctrl.addListeners = function(){
	controller = this;	

	//Refreshes the view to reflect the files that are now available.
	$('body').on('click','#refreshButton',function(e){
		// update everything
		e.preventDefault();
		$("#streamable-files").html("");
		//We cancel any streams
		controller.binarySocket.emit('close');
		//We get the files available to stream
		controller.model.getBrowsableFilesForUser({'username': localStorage.getItem('username')},function(files){		
			view.showAvailableFilesToStream(files);
		});

		controller.updateSharingTab();

		controller.model.getFilesFromUser(localStorage.getItem('username'), function(files) {
			view.showFilesCurrentlyBeingShared(files);					
		});
	})


	$('body').on('click','#signInButton',function(e){
		e.preventDefault();
		username = $('#inputUsername').val();
		if(username == ""){
			view.showEmptyUsernameLoginAttempt();
			return;
		} 
		controller.loginUsername(username);
	});

	// This listener pops up a file dialog and allows the user to select files to be shared. After selection,
	// the user presses OK or Enter and the files selected/about to be shared are shown.
	// Then a list of all users is retrieved from the server and shown to the current user for selection (who
	// the files are to be shared with).
	$('#share-button, #share-button-nav').on('click', function(e) {				
		e.preventDefault();
		//Let's pop-up a dialog prompting the user to add files.
		$('#add-files-dialog').click();
		
		//Called once the user has chosen the files they want
		$('#add-files-dialog').change(function() {
			var files = $('#add-files-dialog')[0].files;
			//We check if any of the files that are going to be shared already have a
			//the same name as those we're sharing.
			var currently_shared_files = controller.model.getCurrentlySharedFiles(controller.current_username,function(data){

				named_same = false;
				file_named_same = "";
				for (var i = data.length - 1; i >= 0; i--) {
					for (var j = files.length - 1; j >= 0; j--) {
						if(files[j].name == data[i].name){
							console.log('You can only share files that have different names!');
							file_named_same = files[j].name;
							named_same =true;
						}
					};
				};

				if(!named_same){
					//We inform the server of the files we have and those we're sharing.
					controller.fileSelectionModal.setShareGroupForFiles(files,function(data){
						toSend = {'files' : files, 'shareGroups' : data['shareGroups'],'username_to_add_to': controller.current_username};
						console.log(files);
						controller.model.notifyServerOfClientsFiles(toSend,function(data){
							//We match files we're sharing by name and associate them with the server ID
							for (var i = data.length - 1; i >= 0; i--) {
								for (var j = files.length - 1; j >= 0; j--) {
									if(files[j].name == data[i].name){
										controller.files_currently_sharing.push({'file' : files[j] , "file_id" : data[i].id})
									}
								};
							};						
							//Finally we update the share tab to show the files that are being shared.	
							controller.model.getFilesFromUser(localStorage.getItem('username'), function(files) {
								view.showFilesCurrentlyBeingShared(files);								
								$('#refreshButton').click();	
							});
						});
					})
				} else {
					alert("You can't share " + file_named_same + ". Because a file you're sharing already has the same name. Remove the file first.");
				}
			});


		});				
	});

	//This is called when the "Create a group button is pressed".
	$('body').on('click','#shareGroupCreation',function(e){
		controller.shareGroupCreationModal.showShareGroupCreationModal(function(res){
			controller.updateSharingTab();
		});	
	});

	//This occurs when the user presses stream for a file in the Browse Tab
	$('body').on('click',".stream-button",function(e){	
		var file_id = $(this).attr('data-file-id');			
		var share_group_id = $(this).attr('data-share-group-id');
		//Create a new stream request for a file located at username
		var req = new StreamRequest(username,file_id);
		
		//Send the request to the server and get the informatino to instantiate a stream object
		controller.model.getStream({'request' : req , 'share_group_id' : share_group_id} ,function(data){			
			if (data['success']) {
				var stream = new Stream(data.source,data.destination,data.file_id,false);
				//Start the stream by notifying the server that we would
				//like to start the stream
				controller.startStreaming(stream);
			}
			else {
				alert('User disconnected or file no longer exists.');
				$('#refreshButton').click();
			}
		});
	});

	//This occurs when the user presses the download button for a file in the browse tab
	$('body').on('click',".download-button",function(e){
		var file_id = $(this).attr('data-file-id');
		var share_group_id = $(this).attr('data-share-group-id');
		//Create a new stream request for a file located a
		//Send the request to the server and get the informatino to instantiate a stream objectt username
		var req = new StreamRequest(username,file_id);
		controller.model.getStream({'request' : req , 'share_group_id' : share_group_id} ,function(data){
			console.log(data);
			if (data['success']) {
				//We set the last parameter to true because we would like to download this file, not stream.
				var stream = new Stream(data.source,data.destination,data.file_id,true);;
				//Start the stream by notifying the server that we would
				//like to start the stream
				controller.startStreaming(stream);
			}
			else {
				alert('User disconnected or file no longer exists.');
				$('#refreshButton').click();
			}
		});
	});


	//Logs the user out,reloads the page and informs the server the username is now free to use
	$('#logout-button').on('click', function(e) {		
		e.preventDefault();				
		var username = localStorage.getItem('username');					
		controller.model.logoutUser(username,function(data){					
				if(data['success']) {
					localStorage.removeItem('username');					
					location.reload();					
				} else {
					alert("Logout failed.");				
				}				
		});
	});

	//Called when the user attempts to edit a file in the sharing tab
	$('body').on('click', '.edit-file-button', function(e) {		
		e.preventDefault();								
		var fileID = $(this).attr('data-file-id');		
		controller.model.getShareGroupsForFile({'id':fileID}, function(data) {						
			controller.fileSelectionModal.editShareGroupForFile(data, function(groups){
				controller.model.updateFileWithShareGroup({'id':fileID, 'shareGroups':groups['shareGroups'],'username' : controller.current_username}, function() {
					controller.model.getFilesFromUser(localStorage.getItem('username'), function(files) {
						view.showFilesCurrentlyBeingShared(files);	
						$('#refreshButton').click();				
					});
				});								
			});
		});
	});
}

/**
 * This function updates the sharing tab of the main page.
 * @return {void}
 */
ctrl.updateSharingTab = function(){
	this.model.getShareGroupsForUser(localStorage.getItem('username'),function(groups){
		controller.view.updateCurrentShareGroupTable(groups);
	})
}


/**
 * Initiates a stream of a file from another users computer
 * @param  {[type]} streamObject [An instance of stream that describes the 
 *                               username of the source of the file and destination of the file.]
 * @return {[void]}              [none]
 */
ctrl.startStreaming = function(streamObject){

	this.model.notifySourceToStartStream(streamObject,function(data){

	});
}





//This function will set up the binary socket and
//all it's associated listners
ctrl.setupBinaryListeners = function(){

	//This function is called when the binary socket
	//RECEIVES a stream
	this.binarySocket.on('stream',function(stream,meta){
		$("#progress-bar[data-file-id='"+meta['file_id']+"']").show();
		// Buffer for parts
          var parts = [];
          // Got new data
          var tx = 0;
          stream.on('data', function(data){                     	
            parts.push(data);                 
            tx += data.byteLength / meta.size;      
            //This will update the progress bar on the exact file in the browsing tab     	
            $("#progress-bar[data-file-id='"+meta['file_id']+"']").val(Math.round(tx*100));            
          });    

          stream.on('close', function(e) {          	  

          	  $("#progress-bar[data-file-id='"+meta['file_id']+"']").hide();
          	  $('#inCaseClose-'+meta['file_id']).html('<strong>User has disconnected or file no longer exists. Refreshing tabs...</strong>');
          	  setTimeout(function() {   //calls click event after a certain time
   					$('#refreshButton').click();
			  }, 2000);          	  
          });

          //This is called when the stream has ended
          //and all parts of the file are in memory
          stream.on('end', function(){          		

	           	$("#progress-bar[data-file-id='"+meta['file_id']+"']").hide();
	           //We get the URL of the file we have streamed or downloaded
	           var url = (window.URL || window.webkitURL).createObjectURL(new Blob(parts));

	           if (meta.download == true) {
	           		//We simply save the blob if we were requesting a download.
	           		var saveData = (function () {
					    var a = document.createElement("a");
					    document.body.appendChild(a);
					    a.style = "display: none";
					    return function (blob, fileName) {
				            url = window.URL.createObjectURL(blob);
					        a.href = url;
					        a.download = fileName;
					        a.click();
					        window.URL.revokeObjectURL(url);
					    };
					}());
	            	saveData(new Blob(parts),meta.name);
	           }
	           else {
	           		//In the case of a stream, we determine the file type and
	           		//handle the case appropriately
		            if(meta.type == "audio/mp3") {		              		              
		              $("#audioFile").attr("src",url);
		              $("#audioFile").attr("type",'audio/mp3')		                					    					  
					  var html = $("#audioFileDiv").html();  			

					  //This slight hack is necessary to have the popup come up!		  		 
  					  html += "<script>\nvar msg = 'Playing: " + meta.name + "';\
  					  	\nvar pos = 0;\
  					  	\nvar spacer = ' ... ';\
  					  	\nvar time_length = 100;\
  					  	\nfunction scrollTitle()\
  					  	\n{\
  					  	\n 	this.document.title = msg.substring(pos, msg.length) + spacer + msg.substring(0, pos);\
  					  	\n 	pos++;\
  					  	\n 	if (pos > msg.length) pos=0;\
  					  	\n 	this.window.setTimeout('scrollTitle()',time_length);\
						\n}\
						scrollTitle()</script>";
					  var w = window.open("","", "width=330, height=120");  
					  w.resizeTo(330, 120);		// need to resize again because browsers have different minimum sizes
					  w.document.write(html);
  					  $(w.document.body).find('#audioFile').trigger('play');		              
		            } else if(meta.type == "video/mp4") {
		              $("#videoFileNameHolder").text(meta.name);
		              $("#videoFile").attr("src",url);
		              $("#videoFile").attr("type",'video/mpeg')		              
  					  var html = $("#videoFileDiv").html();  					  
  					   html += "<script>\nvar msg = 'Playing: " + meta.name + "';\
  					  	\nvar pos = 0;\
  					  	\nvar spacer = ' ... ';\
  					  	\nvar time_length = 100;\
  					  	\nfunction scrollTitle()\
  					  	\n{\
  					  	\n 	this.document.title = msg.substring(pos, msg.length) + spacer + msg.substring(0, pos);\
  					  	\n 	pos++;\
  					  	\n 	if (pos > msg.length) pos=0;\
  					  	\n 	this.window.setTimeout('scrollTitle()',time_length);\
						\n}\
						\nscrollTitle()\
						\nvar video = document.getElementById('videoFile');\
						\nvideo.addEventListener('loadedmetadata', function(){\
						\n		window.resizeTo(this.videoWidth+35, this.videoHeight+85	);\
    					\n});\
						\n</script>";
					  var w = window.open("", "", "width=400, height=400");
  					  w.document.write(html);
  					  $(w.document.body).find('#videoFile').trigger('play');  					  
		            }
	        	}
		});

	});

}


//Set up listners for this.socket...
//Corresponding functions are in server side
ctrl.setSocketIOListeners = function(){
	//This function is called when another user has requested a certain
	//file this user has.
	this.socket.on('startStreaming',function(data){
		for (var i = controller.files_currently_sharing.length - 1; i >= 0; i--) {
			//We check if we have the file by matching the ID
			if(controller.files_currently_sharing[i]['file_id']== data.file_id){
				var fileObject = controller.files_currently_sharing[i]['file']; 
				//We send the file to the server which will reroute it to the user who requested it.
				controller.binarySocket.send(fileObject,{name: fileObject.name, size: fileObject.size, type:fileObject.type ,'destination':data.destination , "file_id" : data.file_id, "download": data.download});
				break;
			}
		};
	});
}

