/**
 * This class will show a pop up modal that allows the user to choose what 
 * share groups the selected files should be shared with.
 * The class requires corresponding HTML code to be written as is deneoted
 * in the index.html <--! Share Group Modal --->
 */

function ShareGroupModal(model,view){
	
	Modal.call(this,model,view);

	this.addListeners();
}

ShareGroupModal.prototype = Object.create(Modal.prototype);

ShareGroupModal.prototype.constructor = ShareGroupModal;

ShareGroupModal.prototype.addListeners = function(){

	var modal = this;
	$('body').on('click','#shareGroupChoosingModal #submitShareWithGlobalGroup',function(e){
		e.preventDefault();
		var groups = [];
		$("#shareGroupDualListBox option").each(function()
		{
		    groups.push($(this).val());
		});
		$('#shareGroupDualListBox').empty();
		$('#shareGroupDualListBox').bootstrapDualListbox('refresh')
		$('#shareGroupChoosingModal').modal('hide');
		modal._closeModal({'shareGroups' : groups});

	});

	$('body').on('click','#shareGroupChoosingModal #submitShareWith',function(e){
		e.preventDefault();	
		var groups = $('#shareGroupDualListBox').val();
		$('#shareGroupDualListBox').empty();
		$('#shareGroupDualListBox').bootstrapDualListbox('refresh')
		$('#shareGroupChoosingModal').modal('hide');
		modal._closeModal({'shareGroups' : groups});
	});
}


ShareGroupModal.prototype.showFileBeingEdited = function(file) {	
	var list = $('#files-to-be-shared');
	$('#fileSelectionModalHeader').html("Editing file:");
	list.empty();
	list.append("<li>" + file.name + "</li>");
}


ShareGroupModal.prototype.setShareGroupForFiles = function(files,callback){
	this._showModalAndGetData(files,callback);
	$('#submitShareWithGlobalGroup').show();
	$('#submitShareWith').html('Share with');
	modal = this;
	if (files.length) {
		this.model.getShareGroupsForUser(localStorage.getItem('username'), function(groups) {
			modal.showShareGroupsOnlineToChooseFrom(groups);			
		});
		modal.showFilesAboutToShare(files);
	}		
}

ShareGroupModal.prototype.showShareGroupsOnlineToChooseFrom = function(shareGroup, selectedShareGroups){
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



ShareGroupModal.prototype.showFilesAboutToShare = function(files){
	var list = $('#files-to-be-shared');
	list.empty();
	for (var i = files.length - 1; i >= 0; i--) {
		list.append("<li>" + files[i]['name'] + "</li>");
	};	
}


// Displays the share groups that a user can share with (if any files were selected to be shared)
ShareGroupModal.prototype.editShareGroupForFile = function(data,callback){
	this._showModalAndGetData(data,callback);
	$('#submitShareWithGlobalGroup').hide();
	$('#submitShareWith').html('Update');
	var modal = this;
	this.model.getShareGroupsForUser(localStorage.getItem('username'), function(groups) {		
		modal.showShareGroupsOnlineToChooseFrom(groups, data['shareGroups']);
	});			
	this.showFileBeingEdited(data['file']);
}







