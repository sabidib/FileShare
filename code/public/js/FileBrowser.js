var FileBrowser = function FileBrowser(model,view){
	this.model = model;
	this.view = view;	
}


fbr = FileBrowser.prototype;

fbr.showFilesForUser = function(username){
	this.model.getBrowsableFilesForUser({'username': username},function(files){		
		view.showAvailableFilesToStream(files);
	});
}








