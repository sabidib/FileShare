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


FileSelectionModal.prototype.getShareGroupsToShareWith = function(files,callback){
	this.tempCallback = callback; 
	this.model.getAllShareGroups(function(data){
		view.showShareGroupsOnlineToChooseFrom(data['shareGroups']);
	})
}





