var FileSelectionModal = function FileSelectionModal(model,view){
	this.view = view;
	this.model = model;
	this.tempCallback = {};
	this.addListeners();
}



FileSelectionModal.prototype.addListeners = function(){

	var modal = this;
	$('body').on('click','#shareGroupChoosingModal #submitShareWithGlobalGroup',function(e){
		e.preventDefault();
		var groups = [];
		$("#shareGroupDualListBox option").each(function()
		{
		    groups.push($(this).val());
		});
		modal.tempCallback({'shareGroups': groups});
		modal.tempCallback = {};
		$('#shareGroupDualListBox').empty();
		$('#shareGroupDualListBox').bootstrapDualListbox('refresh')
		$('#shareGroupChoosingModal').modal('hide');

	});

	$('body').on('click','#shareGroupChoosingModal #submitShareWith',function(e){
		e.preventDefault();	
		var groups = $('#shareGroupDualListBox').val();
		modal.tempCallback({'shareGroups':groups});
		modal.tempCallback = {};
		$('#shareGroupDualListBox').empty();
		$('#shareGroupDualListBox').bootstrapDualListbox('refresh')
		$('#shareGroupChoosingModal').modal('hide');
	});
}

// Displays the share groups that a user can share with (if any files were selected to be shared)
FileSelectionModal.prototype.getShareGroupsToShareWith = function(files,callback){
	this.tempCallback = callback; 
	$('#submitShareWithGlobalGroup').show();
	$('#submitShareWith').html('Share with');
	if (files.length) {
		this.model.getShareGroupsForUser(localStorage.getItem('username'), function(groups) {
			view.showShareGroupsOnlineToChooseFrom(groups);			
		});
		view.showFilesAboutToShare(files);
	}	
}

// Displays the share groups that a user can share with (if any files were selected to be shared)
FileSelectionModal.prototype.editFileShareGroups = function(data,callback){
	this.tempCallback = callback;
	$('#submitShareWithGlobalGroup').hide();
	$('#submitShareWith').html('Update');
	this.model.getShareGroupsForUser(localStorage.getItem('username'), function(groups) {		
		view.showShareGroupsOnlineToChooseFrom(groups, data['shareGroups']);
	});			
	view.showFileBeingEdited(data['file']);
}







