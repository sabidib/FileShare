var FileBrowser = function FileBrowser(model,view){
	this.model = model;
	this.view = view;	
}


fbr = FileBrowser.prototype;


fbr.showFilesFromShareGroup = function(shareGroupID,amount){
	this.model.getFilesFromShareGroup({'id' : shareGroupID, 'amount':amount},function(data){
		view.showAvailableFilesToStream(data['files']);
	});
}






