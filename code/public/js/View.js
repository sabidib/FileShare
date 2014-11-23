

var View = function View(){

}

v = View.prototype;

v.showLoginForm = function(container){
	html = ""
}

v.showMainPage = function(username){
	if(username) {
		$('#loginContainer').hide();
		$('#mainContainer').show();
		$('#files').show();
		$('.usernameBlank').html(username);
	}
	else {
		$('#loginContainer').show();
		$('#mainContainer').hide();
		$('#files').hide();
		$('.usernameBlank').html();	
	}
}

v.showFilesAboutToShare = function(files) {	
	var list = $('#files-to-be-shared');
	list.empty();
	for (var i = files.length - 1; i >= 0; i--) {
		list.append("<li>" + files[i]['name'] + "</li>");
	};	
}


v.showFileBeingEdited = function(file) {	
	var list = $('#files-to-be-shared');
	$('#fileSelectionModalHeader').html("Editing file:");
	list.empty();
	list.append("<li>" + file.name + "</li>");
}


v.showMustAddUsernamesForCreateShareGroup = function(){
	$('#userDualListBox').tooltip({'title':"You need to select at least 1 user!"});
	$('#userDualListBox').tooltip('show')
	setTimeout(function() {
		$('#userDualListBox').tooltip('destroy')
	}, 4000);
}


v.updateCurrentShareGroupTable = function(groups){
	var list = $('#shareGroups #shareGroupList');
	list.empty();
	for (var i = groups.length - 1; i >= 0; i--) {
		list.append("<li data-id-share-group-id='"+groups[i]['id']+"'>" + groups[i]['name'] + "</li>");
	};	
}
v.showShareGroupsOnlineToChooseFrom = function(shareGroup, selectedShareGroups){
	$('#shareGroupChoosingModal').modal('show');	
	var list = $('#shareGroupDualListBox').bootstrapDualListbox();	
	selected = {};	
	if (selectedShareGroups) {
		for (var i = selectedShareGroups.length - 1; i >= 0; i--) {
			selected[selectedShareGroups[i]['id']] = true;
		};
	}
	list.empty();
	for (var i = shareGroup.length - 1; i >= 0; i--) {		
		if (selected[shareGroup[i]['id']]) {
			list.append("<option selected value='"+shareGroup[i]['id']+"'>"+shareGroup[i]['name']+"</option>");
		}
		else {
			list.append("<option value='"+shareGroup[i]['id']+"'>"+shareGroup[i]['name']+"</option>");
		}
	};
	list.bootstrapDualListbox('refresh');
}

v.showUsersOnlineForShareGroupCreationModal = function(users){
	var list = $('#userDualListBox').bootstrapDualListbox();	
	list.empty();
	for (var i = users.length - 1; i >= 0; i--) {
		list.append("<option value='"+users[i]['username']+"'>"+users[i]['username']+"</option>");
	};
	$('#userDualListBox').val(localStorage.getItem('username'));
	list.bootstrapDualListbox('refresh');
}


v.showLoginFailure = function(data,name) {
	$('#signInButton').tooltip({'title':"We couldn't log you in...sorry!..try again?"});
	$('#signInButton').tooltip('show')
	setTimeout(function() {
		$('#signInButton').tooltip('destroy')
	}, 4000);
};

v.showCreateShareGroupNameExists = function(){
	$('#shareGroupNameToCreate').tooltip({'title':"A share group with this name already exists"});
	$('#shareGroupNameToCreate').tooltip('show')
	setTimeout(function() {
		$('#shareGroupNameToCreate').tooltip('destroy')
	}, 4000);
}


v.showEmptyUsernameLoginAttempt = function(){
	$('#inputUsername').tooltip({'title':"You need to enter a username"});
	$('#inputUsername').tooltip('show')
	setTimeout(function() {
		$('#inputUsername').tooltip('destroy')
	}, 4000);
}

v.showUsernameAlreadyBeingUsed = function(){
	$('#inputUsername').tooltip({'title':"Someone is already using that name"});
	$('#inputUsername').tooltip('show')
	setTimeout(function() {
		$('#inputUsername').tooltip('destroy')
	}, 4000);
}


v.showAvailableFilesToStream = function(data){
	htmlString = ""
	if (data) {	
		$.each(data, function(i, f) {		
			htmlString += "<tr><td>" + f.name + "<progress id='progress-bar' data-file-id='"+f.id+"' max='100' value='0' style='display:none;'></progress>"
			htmlString += "</td><td>" + f.shareGroup.name +  "</td>";
			htmlString += "<td><button class='download-button' name='" + f.name + "'data-file-id='"+f.id+"' data-share-group-id='"+f.shareGroup.id+"'>Download</button></td>";			
			console.log(f);
			if (f.type == 'audio/mp3' || f.type == 'video/mp4') {
				htmlString += "<td><button class='stream-button' data-file-id='"+f.id+"' data-share-group-id='"+f.shareGroup.id+"'>Stream</button></td></tr>";
			}			
			else {
				htmlString += "<td></td></tr>"
			}
		});
	}
	else {
		htmlString = "No files can be downloaded or streamed this moment."
	}	
	$('#streamable-files').append(htmlString);
}

v.showFilesCurrentlyBeingShared = function(data) {	
	htmlString = "";
	console.log(data);
	if (data.length > 0) {	
		var files = {};
		var fileIDs = {};		
		var file_names = [];
		htmlString += "<table><thead><th>Filename</th><th>Share Groups</th><th>Edit</th></thead><tbody>";	
		$.each(data, function(i, f) {					
			if (!files[f.name]) {
				files[f.name] = [];				
				file_names.push(f.name);				
				fileIDs[f.name] = f.id;
			}			
			files[f.name].push(f.shareGroup.name);	
		});
		file_names.sort();		
		file_names.forEach(function (f) {									
			htmlString += "<tr class='sharedFile'><td>" + f + "</td><td>" + files[f].join(',') +  "</td>";
			htmlString += "<td><button class='edit-file-button' data-file-id='" + fileIDs[f] + "'>Edit</button></td></tr>"
		});		

		htmlString += "</tbody></table>";	
	}
	else {
		htmlString += "No files being shared at this moment."
	}
	$('#shared-files').html(htmlString);
};



v.showPickUsers = function(users) {	
	htmlString = "<div id='user-list'>";
	htmlString += "<h2 style='margin-bottom:0;'>Who?</h2>";
	htmlString += "<ul class='alt'>"
	$.each(users, function(i, u) {		
		htmlString += "<li>" + u.name + "</li>";
	});
	htmlString += "</ul></div>";	
	$('#main-body').html(htmlString);
};