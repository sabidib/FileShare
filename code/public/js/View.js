

var View = function View(){

}

View.prototype.showLoginPage = function(){
	html = ""

}


View.prototype.loadMainPage = function(data,name) {

	htmlString += getTableOfFiles(data.file_array)

	$('#mainBody').html(htmlString)
};


View.prototype.showFilesAboutToBeShared = function(data) {	
	htmlString = "<div id='file-list'>";
	htmlString += "<h2 style='margin-bottom:0;'>You are about to share these files:</h2>";
	htmlString += "<ul class='alt'>"
	$.each(data, function(i, f) {		
		htmlString += "<li>" + f.name + "</li>";
	});
	htmlString += "</ul></div>";	
	$('#about-to-share').html(htmlString);
};

View.prototype.showPickUsers = function(users) {	
	htmlString = "<div id='user-list'>";
	htmlString += "<h2 style='margin-bottom:0;'>Who?</h2>";
	htmlString += "<ul class='alt'>"
	$.each(users, function(i, u) {		
		htmlString += "<li>" + u.name + "</li>";
	});
	htmlString += "</ul></div>";	
	$('#main-body').html(htmlString);
};