

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

v.showShareGroupsOnlineToChooseFrom = function(shareGroup){		
	$('#shareGroupChoosingModal').modal('show');	
	var list = $('#shareGroupDualListBox').bootstrapDualListbox();	
	list.empty();
	for (var i = shareGroup.length - 1; i >= 0; i--) {
		list.append("<option value='"+shareGroup[i]['id']+"'>"+shareGroup[i]['name']+"</option>");
	};
	list.bootstrapDualListbox('refresh');
}

v.showLoginFailure = function(data,name) {
	$('#signInButton').tooltip({'title':"We couldn't log you in...sorry!..try again?"});
	$('#signInButton').tooltip('show')
	setTimeout(function() {
		$('#signInButton').tooltip('destroy')
	}, 4000);
};

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
	if (data) {	
		htmlString = "<table><thead><th>Filename</th><th>Share Group</th><th>Download</th><th>Stream</th></thead><tbody>";	
		$.each(data, function(i, f) {		
			htmlString += "<tr><td>" + f.name + "</td><td>" + f.shareGroup.name +  "</td>";
			htmlString += "<td><button class='download-button' data-file-id='"+f.id+"' data-share-group-id='"+f.shareGroup.id+"'>Download</button></td>";			
			htmlString += "<td><button class='stream-button' data-file-id='"+f.id+"' data-share-group-id='"+f.shareGroup.id+"'>Stream</button></td></tr>";
		});
		htmlString += "</tbody></table>";	
	}
	else {
		htmlString = "No files can be downloaded or streamed this moment."
	}	
	$('#streamable-files').html(htmlString);
}

v.showFilesCurrentlyBeingShared = function(data) {	
	if (data) {	
		htmlString = "<table><thead><th>Filename</th><th>Share Groups</th></thead><tbody>";	
		$.each(data, function(i, f) {		
			htmlString += "<tr class='sharedFile' data-file-id='"+f.id+"' data-share-group-id='"+f.shareGroup.id+"'><td>" + f.name + "</td><td>" + f.shareGroup.name +  "</td></tr>";
		});
		htmlString += "</tbody></table>";	
	}
	else {
		htmlString = "No files being shared at this moment."
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