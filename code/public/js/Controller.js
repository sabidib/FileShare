


var Controller = function Controller(hostname,port){
	
	this.binarySocket = {};
	this.socket = {};

	this.setupSocketIO();
	this.setupBinary(hostname,port);
	console.log(hostname + " " + port)
 	this.hostname = hostname;
 	this.port = port;
	this.current_username = "";

	model = new Model(this.socket,this.binarySocket);
	view = new View();

	this.model =model;
	this.view = view;

	this.fileSelectionModal = new FileSelectionModal(this.model,this.view);
	this.shareGroupCreationModal = new ShareGroupCreationModal(this.model,this.view);


	this.fileBrowser = new FileBrowser(this.model,this.view);
	this.files_currently_sharing = [];
	this.binarySocket.on('stream',function(stream,meta){
		console.log('receiving stream!!!');		
		$("#progress-bar[data-file-id='"+meta['file_id']+"']").show();
		// Buffer for parts
          var parts = [];
          // Got new data
          var tx = 0;
          stream.on('data', function(data){                     	
            parts.push(data);                 
            tx += data.byteLength / meta.size;           	
            $("#progress-bar[data-file-id='"+meta['file_id']+"']").val(Math.round(tx*100));            
          });     
          stream.on('close', function(e) {          	  
          	  $("#progress-bar[data-file-id='"+meta['file_id']+"']").hide();
          	  $('#inCaseClose-'+meta['file_id']).html('<strong>User has disconnected or file no longer exists. Refreshing tabs...</strong>');
          	  setTimeout(function() {   //calls click event after a certain time
   					$('#refreshButton').click();
			  }, 2000);          	  
          });
          stream.on('end', function(){          		
	            $("#audioFile").trigger('stop');
	            $("#videoFile").trigger('stop');
	           	$("#progress-bar[data-file-id='"+meta['file_id']+"']").hide();
	            // Display new data in browser!
	           var url = (window.URL || window.webkitURL).createObjectURL(new Blob(parts));
	           if (meta.download == true) {
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
		            if(meta.type == "audio/mp3") {		              		              
		              $("#audioFile").attr("src",url);
		              $("#audioFile").attr("type",'audio/mp3')		                					    					  
					  var html = $("#audioFileDiv").html();  					  		 
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
				//this.binarySocket.removeAllListeners('stream');
		});

	});

	
	//view.showLoginPage()
	this.addListeners();
}

ctrl = Controller.prototype;


ctrl.setupSocketIO = function(){
    this.socket = io();    
    this.setSocketIOListeners();
}

ctrl.setupBinary = function(hostname,port){
    this.binarySocket = new BinaryClient('ws://'+hostname+':'+port);
}

ctrl.setCurrentUsername = function(username){
	this.current_username = username;
}

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

ctrl.addListeners = function(){
	controller = this;	
	$(document).ready(function() {
		username = localStorage.getItem('username');
		if(username != "" && username != undefined){
			controller.loginUsername(username);
			view.showMainPage(username)
		} else {
			view.showMainPage();
		}

	});
	$('body').on('click','#refreshButton',function(e){
		// update everything
		$("#streamable-files").html("");
		controller.binarySocket.emit('close');
		controller.fileBrowser.showFilesForUser(localStorage.getItem('username'));	
		controller.updateSharingTab();
		controller.model.getFilesFromUser(localStorage.getItem('username'), function(files) {
			view.showFilesCurrentlyBeingShared(files);					
		});
	})



	$('body').on('show.bs.tab','a[data-toggle="tab"]',function(e){
		if($(e.target).attr('href') == "#browsing"){
			$("#streamable-files").html("");
			controller.fileBrowser.showFilesForUser(localStorage.getItem('username'));	
		} else if($(e.target).attr('href') == "#shareGroups"){
			controller.updateSharingTab();
		}
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
	$('#share-button').on('click', function(e) {				
		e.preventDefault();
		$('#add-files-dialog').click();
		$('#add-files-dialog').change(function() {
			var files = $('#add-files-dialog')[0].files;
			var currently_shared_files = controller.model.getCurrentlySharedFiles(controller.current_username,function(data){
				named_same = false;
				for (var i = data.length - 1; i >= 0; i--) {
					for (var j = files.length - 1; j >= 0; j--) {
						if(files[j].name == data[i].name){
							console.log('You can only share files that have different names!');
							named_same =true;
						}
					};
				};

				if(!named_same){
					controller.fileSelectionModal.getShareGroupsToShareWith(files,function(data){
						toSend = {'files' : files, 'shareGroups' : data['shareGroups'],'username_to_add_to': controller.current_username};
						controller.model.notifyServerOfClientsFiles(toSend,function(data){
							//We match files we're sharing by name and associate them with the server ID
							for (var i = data.length - 1; i >= 0; i--) {
								for (var j = files.length - 1; j >= 0; j--) {
									if(files[j].name == data[i].name){
										controller.files_currently_sharing.push({'file' : files[j] , "file_id" : data[i].id})
									}
								};
							};							
							controller.model.getFilesFromUser(localStorage.getItem('username'), function(files) {
								view.showFilesCurrentlyBeingShared(files);					
							});
						});
					})
				} else {
					////
					///
					///
					///Alert the user that they tried to share files with the same name
					///
					///
					///
				}
			});


		});				
	});

	$('body').on('click','#shareGroupCreation',function(e){
		controller.shareGroupCreationModal.showShareGroupCreationModal(function(res){
			controller.updateSharingTab();
		});	
	});

	$('body').on('click',".stream-button",function(e){	
		var file_id = $(this).attr('data-file-id');			
		var share_group_id = $(this).attr('data-share-group-id');
		var req = new StreamRequest(username,file_id);
		
		controller.model.getStream({'request' : req , 'share_group_id' : share_group_id} ,function(data){			
			if (data['success']) {
				var stream = new Stream(data.source,data.destination,data.file_id,false);
				controller.startStreaming(stream);
			}
			else {
				alert('User disconnected or file no longer exists.');
				$('#refreshButton').click();
			}
		});
	});
	$('body').on('click',".download-button",function(e){
		var file_id = $(this).attr('data-file-id');
		var share_group_id = $(this).attr('data-share-group-id');
		var req = new StreamRequest(username,file_id);
		controller.model.getStream({'request' : req , 'share_group_id' : share_group_id} ,function(data){
			console.log(data);
			if (data['success']) {
				var stream = new Stream(data.source,data.destination,data.file_id,true);
				controller.startStreaming(stream);
			}
			else {
				alert('User disconnected or file no longer exists.');
				$('#refreshButton').click();
			}
		});
	});

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


	$('body').on('click', '.edit-file-button', function(e) {		
		e.preventDefault();								
		var fileID = $(this).attr('data-file-id');		
		controller.model.getShareGroupsForFile({'id':fileID}, function(data) {						
			controller.fileSelectionModal.editFileShareGroups(data, function(groups){
				controller.model.updateFileWithShareGroup({'id':fileID, 'shareGroups':groups['shareGroups'],'username' : controller.current_username}, function() {
					controller.model.getFilesFromUser(localStorage.getItem('username'), function(files) {
						view.showFilesCurrentlyBeingShared(files);					
					});
				});								
			});
		});
	});
}


ctrl.updateSharingTab = function(){
	this.model.getShareGroupsForUser(localStorage.getItem('username'),function(groups){
		controller.view.updateCurrentShareGroupTable(groups);
	})
}


ctrl.startStreaming = function(streamObject){
	//Prepare the binary js listeners to receive the data
	this.model.notifySourceToStartStream(streamObject,function(data){

	});
}



ctrl.handleSendingFile = function(){
}


ctrl.setupBinaryListeners = function(){
	this.binarySocket.on('open',this.handleSendingFile)
	this.binarySocket.on('stream',this.receiveStreamFromServer)
}

ctrl.setSocketIOListeners = function(){
	this.socket.on('startStreaming',function(data){
		for (var i = controller.files_currently_sharing.length - 1; i >= 0; i--) {
			if(controller.files_currently_sharing[i]['file_id']== data.file_id){
				var fileObject = controller.files_currently_sharing[i]['file']; 
				controller.binarySocket.send(fileObject,{name: fileObject.name, size: fileObject.size, type:fileObject.type ,'destination':data.destination , "file_id" : data.file_id, "download": data.download});
				break;
			}
		};
	});
}


ctrl.setSessionID = function(sessionID){
	this.sessionID = sessionID; 
}

ctrl.getSessionID = function(){
	return sessionID;
}