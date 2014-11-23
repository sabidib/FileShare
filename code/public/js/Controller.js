


var Controller = function Controller(hostname,port){
	
	this.binarySocket = {};
	this.socket = {};

	this.setupSocketIO();
	this.setupBinary(hostname,port);
 


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
		$('#progress-bar').show();
		// Buffer for parts
          var parts = [];
          // Got new data
          var tx = 0;
          stream.on('data', function(data){            
            parts.push(data);                 
            tx += data.byteLength / meta.size;           	
            $('#progress-bar').val(Math.round(tx*100));            
          });

          stream.on('end', function(){          		
	            $("#audioFile").trigger('stop');
	            $("#videoFile").trigger('stop');
	            $('#progress-bar').hide();
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
		              $("#audioFileNameHolder").text(meta.name);
		              $("#audioFile").attr("src",url);
		              $("#audioFile").attr("type",'audio/mp3')
		              $("#audioFile").trigger('play');
		            } else if(meta.type == "video/mp4") {
		              $("#videoFileNameHolder").text(meta.name);
		              $("#videoFile").attr("src",url);
		              $("#videoFile").attr("type",'video/mpeg')
		              $("#videoFile").trigger('play');
		            } else if(meta.type.indexOf("image/") > -1){
		              $("#imageFile").attr("src",url);
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

ctrl.addListeners = function(){
	controller = this;	
	$(document).ready(function() {
		username = localStorage.getItem('username');		
		if (username){			
			controller.model.loginUser(username,function(data){
				if(data['success']){
					view.showMainPage(username);				
				} else {
					view.showLoginFailure();
				}				
			});
		}
		else {
			view.showMainPage();
		}
	});


	$('body').on('show.bs.tab','a[data-toggle="tab"]',function(e){
		if($(e.target).attr('href') == "#browsing"){
			controller.fileBrowser.showFilesFromShareGroup(0,100);
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
		controller.model.isUserConnected(username,function(data){
			console.log(data);
			if(!data['isUserConnected']){
				controller.model.loginUser(username,function(data){
					if(data['success']){
						view.showMainPage(username);	
						localStorage.setItem('username', username);
					} else {
						view.showLoginFailure();
					}
				});
			} else {
				view.showUsernameAlreadyBeingUsed();
			}
		});
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
			var currently_shared_files = controller.model.getCurrentlySharedFiles(function(data){
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
						toSend = {'files' : files, 'shareGroups' : data['shareGroups']};
						controller.model.notifyServerOfClientsFiles(toSend,function(data){
							//We match files we're sharing by name and associate them with the server ID
							for (var i = data.length - 1; i >= 0; i--) {
								for (var j = files.length - 1; j >= 0; j--) {
									if(files[j].name == data[i].name){
										controller.files_currently_sharing.push({'file' : files[j] , "file_id" : data[i].id})
									}
								};
							};							
							view.showFilesCurrentlyBeingShared(data);
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
		var req = new StreamRequest(file_id);
		controller.model.getStream({'request' : req , 'share_group_id' : share_group_id} ,function(data){
			var stream = new Stream(data.source,data.destination,data.file_id);
			controller.startStreaming(stream);
		});
	});
	$('body').on('click',".download-button",function(e){
		var file_id = $(this).attr('data-file-id');
		var share_group_id = $(this).attr('data-share-group-id');
		var req = new StreamRequest(file_id);
		controller.model.getStream({'request' : req , 'share_group_id' : share_group_id} ,function(data){
			var stream = new Stream(data.source,data.destination,data.file_id, true);
			controller.startStreaming(stream);
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
				controller.model.updateFileWithShareGroup({'id':fileID, 'shareGroups':groups['shareGroups']}, function() {
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


ctrl.receiveStreamFromServer = function(stream,meta){
	  // Buffer for parts
	  var parts = [];
	  // Got new data
	  stream.on('data', function(data){            
	    parts.push(data);
	  });
	  stream.on('end', function(){
          console.log(meta);
          // Buffer for parts
          var parts = [];
          // Got new data
          stream.on('data', function(data){            
            parts.push(data);
          });
          stream.on('end', function(){
            $("#audioFile").trigger('stop');
            $("#videoFile").trigger('stop');

            // Display new data in browser!
           var url = (window.URL || window.webkitURL).createObjectURL(new Blob(parts));
            if(meta.type == "audio/mp3") {
              $("#audioFileNameHolder").text(meta.name);
              $("#audioFile").attr("src",url);
              $("#audioFile").attr("type",'audio/mp3')
              $("#audioFile").trigger('play');
            } else if(meta.type == "video/mp4") {
              $("#videoFileNameHolder").text(meta.name);
              $("#videoFile").attr("src",url);
              $("#videoFile").attr("type",'video/mpeg')
              $("#videoFile").trigger('play');
            } else if(meta.type.indexOf("image/") > -1){
              $("#imageFile").attr("src",url);
            } else {

            }

          });
	  });
}





ctrl.setSessionID = function(sessionID){
	this.sessionID = sessionID; 
}

ctrl.getSessionID = function(){
	return sessionID;
}