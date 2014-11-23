var ShareGroupCreationModal = function ShareGroupCreationModal(model,view){
	this.view = view;
	this.model = model;
	this.addListeners();
	this.tmpCallback = {};
}

sgcm = ShareGroupCreationModal.prototype;

sgcm.addListeners = function(){
	var modal = this;

	$('body').on('click', '#shareGroupCreationModal #createShareGroup',function(e){
		modal.model.getAllShareGroups(function(data){
			var shareName = $('#shareGroupCreationModal #shareGroupNameToCreate').val();
			for (var i = data['shareGroups'].length - 1; i >= 0; i--) {
				if(data['shareGroups'][i].name == shareName){
					v.showCreateShareGroupNameExists();
					return;
				}
			};
			modal.model.createShareGroup(shareName,function(data){
				var usernames = $('#userDualListBox').val();
				if(usernames == []){
					v.showMustAddUsernamesForCreateShareGroup();
					return;
				}
				modal.model.addUsersToShareGroup(usernames,data['id'],function(usersAdded){
					console.log(usersAdded);
					modal.tmpCallback({'users' : usersAdded , 'shareGroupID' : data['id'], 'shareGroupName' : shareName});
					modal.clearModal();
					modal.closeModal();
				})

			});
		})
	});

	$('body').on('click', '#shareGroupCreationModal #closeCreateShareGroup',function(e){
		modal.clearModal();
		modal.closeModal();
	})

}

sgcm.clearModal = function(){	
	$('#shareGroupNameToCreate').val('');
	$('#userDualListBox').empty();
	$('#userDualListBox').bootstrapDualListbox('refresh')
}

sgcm.closeModal = function(){
	$('#shareGroupCreationModal').modal('hide');
}

sgcm.showShareGroupCreationModal = function(callback){
	this.tmpCallback = callback;
	$('#shareGroupCreationModal').modal('show');
	this.model.getUsersOnline(function(data){
		view.showUsersOnlineForShareGroupCreationModal(data['users']);			
	});
}





