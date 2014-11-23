

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

v.updateCurrentShareGroupTable = function(groups){
	var list = $('#shareGroups #shareGroupList');
	list.empty();
	for (var i = groups.length - 1; i >= 0; i--) {
		list.append("<li data-id-share-group-id='"+groups[i]['id']+"'>" + groups[i]['name'] + "</li>");
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

	htmlString = "<div class='file-list'>";
	htmlString += "<ul class='alt'>"
	$.each(data, function(i, f) {		
		htmlString += "<li class='streamableFile' data-file-id='"+f.id+"' data-share-group-id='"+f.shareGroup.id+"'>" + f.name + ", share group:" + f.shareGroup.name +  " from user : " + f.user +"</li>";
	});
	htmlString += "</ul></div>";	
	$('#streamable-files').html(htmlString);
}

v.showFilesCurrentlyBeingShared = function(data) {	
	htmlString = "<div class='file-list'>";
	htmlString += "<ul class='alt'>"
	$.each(data, function(i, f) {		
		htmlString += "<li class='sharedFile' data-file-id='"+f.id+"' data-share-group-id='"+f.shareGroup.id+"'>" + f.name + ", share group:" + f.shareGroup.name +  "</li>";
	});
	htmlString += "</ul></div>";	
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