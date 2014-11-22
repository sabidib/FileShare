

var View = function View(){

}

v = View.prototype;

v.showLoginForm = function(container){
	html = ""
}

v.showMainPage = function(username){
	$('#loginContainer').hide();
	$('#mainContainer').show();
	$('#files').show();
	$('.usernameBlank').html(username);

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


v.showFilesAboutToBeShared = function(data) {	
	htmlString = "<div id='file-list'>";
	htmlString += "<h2 style='margin-bottom:0;'>You are about to share these files:</h2>";
	htmlString += "<ul class='alt'>"
	$.each(data, function(i, f) {		
		htmlString += "<li>" + f.name + "</li>";
	});
	htmlString += "</ul></div>";	
	$('#about-to-share').html(htmlString);
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