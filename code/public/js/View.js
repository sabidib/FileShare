

var View = function View(){

}


View.prototype.loadMainPage = function(data,name) {

	htmlString += getTableOfFiles(data.file_array)

	$('#mainBody').html(htmlString)
};


View.prototype.showFilesAboutToBeShared = function(data) {	
	htmlString = "";
	htmlString += "<h3>About to share the following files:</h3> <br>";
	htmlString += "<ul>"
	$.each(data, function(i, f) {		
		htmlString += "<li>" + f.name + "</li>";
	});
	htmlString += "</ul>";
	$('#main-body').html(htmlString);
};