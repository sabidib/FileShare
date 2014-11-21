

var View = function View(){

}


View.prototype.loadMainPage = function(data,name) {

	htmlString += getTableOfFiles(data.file_array)

	$('#mainBody').html(htmlString)
};