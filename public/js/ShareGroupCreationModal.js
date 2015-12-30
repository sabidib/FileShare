/**
 * This class will create a share group.
 * Sub class of Modal
 */


function ShareGroupCreationModal(model, view) {
    Modal.call(this, model, view);
    this.addListeners();

}


ShareGroupCreationModal.prototype = Object.create(Modal.prototype);

ShareGroupCreationModal.prototype.constructor = ShareGroupCreationModal;

ShareGroupCreationModal.prototype.addListeners = function() {
    var modal = this;

    $('body').on('click', '#shareGroupCreationModal #createShareGroup', function(e) {
        modal.createShareGroup();
    });

    $('body').on('click', '#shareGroupCreationModal #closeCreateShareGroup', function(e) {
        modal.clearModal();
        modal._closeModal();
        modal.closeModal();
    })

}



ShareGroupCreationModal.prototype.createShareGroup = function() {
    var modal = this;
    modal.model.getAllShareGroups(function(data) {
        var shareName = $('#shareGroupCreationModal #shareGroupNameToCreate').val();
        for (var i = data['shareGroups'].length - 1; i >= 0; i--) {
            if (data['shareGroups'][i].name == shareName) {
                modal.showCreateShareGroupNameExists();
                return;
            }
        };

        var usernames = $('#userDualListBox').val();
        if (usernames == null) {
            modal.showMustAddUsernamesForCreateShareGroup();
            return;
        }
        modal.model.createShareGroup(shareName, function(data) {
            console.log("users to add to shareGroup " + shareName + " > " + usernames)
            modal.model.addUsersToShareGroup(usernames, data['id'], function(usersAdded) {
                modal.clearModal();
                modal._closeModal({
                    'users': usersAdded,
                    'shareGroupID': data['id'],
                    'shareGroupName': shareName
                });
                modal.closeModal();
            })

        });
    })
}



ShareGroupCreationModal.prototype.showCreateShareGroupNameExists = function() {
    $('#shareGroupNameToCreate').tooltip({
        'title': "A share group with this name already exists"
    });
    $('#shareGroupNameToCreate').tooltip('show')
    setTimeout(function() {
        $('#shareGroupNameToCreate').tooltip('destroy')
    }, 4000);
}



ShareGroupCreationModal.prototype.showMustAddUsernamesForCreateShareGroup = function() {
    $('#shareGroupNameToCreate').tooltip({
        'title': "You need to select at least 1 user!"
    });
    $('#shareGroupNameToCreate').tooltip('show')
    setTimeout(function() {
        $('#shareGroupNameToCreate').tooltip('destroy')
    }, 4000);
}



ShareGroupCreationModal.prototype.showUsersOnlineForShareGroupCreationModal = function(users) {
    var list = $('#userDualListBox').bootstrapDualListbox();
    list.empty();
    for (var i = users.length - 1; i >= 0; i--) {
        list.append("<option value='" + users[i]['username'] + "'>" + users[i]['username'] + "</option>");
    };
    $('#userDualListBox').val(localStorage.getItem('username'));
    list.bootstrapDualListbox('refresh');
}



ShareGroupCreationModal.prototype.clearModal = function() {
    $('#shareGroupNameToCreate').val('');
    $('#userDualListBox').empty();
    $('#userDualListBox').bootstrapDualListbox('refresh')
}

ShareGroupCreationModal.prototype.closeModal = function() {
    $('#shareGroupCreationModal').modal('hide');
}

ShareGroupCreationModal.prototype.showShareGroupCreationModal = function(callback) {
    this._showModalAndGetData({}, callback)
    $('#shareGroupCreationModal').modal('show');
    modal = this;
    this.model.getUsersOnline(function(data) {
        modal.showUsersOnlineForShareGroupCreationModal(data['users']);
    });
}
