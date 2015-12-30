/**
 * The view class handles all view elements of the main window.
 * Any view related updates to individual modals are handled in their own classes.
 */

var View = function View() {

}

v = View.prototype;

//Displays the main page
v.showMainPage = function(username) {
    if (username) {
        $('#loginContainer').fadeOut(500, function() {
            $('#mainContainer').fadeIn(500, function() {
                $('#contentSections').fadeIn(500);
            })
        });
        $('.usernameBlank').html(username);
    } else {
        $('#loginContainer').fadeIn(500, function() {
            $('#mainContainer').hide();
            $('#contentSections').hide();
        });
        $('.usernameBlank').html();
    }
    $('#refreshButton').click();
}

//Updates the share group table
v.updateCurrentShareGroupTable = function(groups) {
    htmlString = "";
    if (groups.length > 0) {
        htmlString += "<table id='sharegroups-table'><thead><th>Name</th><th>Users</th></thead><tbody>"
        for (var i = groups.length - 1; i >= 0; i--) {
            htmlString += "<tr><td>" + groups[i]['name'] + "</td><td>" + groups[i]['users'].join(', ') + "</td></tr>";
        };
        htmlString += "</tbody></table>";
    } else {
        htmlString += "You are not part of any share groups."
    }
    $('#shareGroupList').html(htmlString);
    $('#sharegroups-table').DataTable();
}

//Indicates there was a general login failure
v.showLoginFailure = function(data, name) {
    $('#signInButton').tooltip({
        'title': "We couldn't log you in...sorry!..try again?"
    });
    $('#signInButton').tooltip('show')
    setTimeout(function() {
        $('#signInButton').tooltip('destroy')
    }, 4000);
};

//Empty username error
v.showEmptyUsernameLoginAttempt = function() {
    $('#inputUsername').tooltip({
        'title': "You need to enter a username"
    });
    $('#inputUsername').tooltip('show')
    setTimeout(function() {
        $('#inputUsername').tooltip('destroy')
    }, 4000);
}

//The username is already connected error!
v.showUsernameAlreadyBeingUsed = function() {
    $('#inputUsername').tooltip({
        'title': "Someone is already using that name"
    });
    $('#inputUsername').tooltip('show')
    setTimeout(function() {
        $('#inputUsername').tooltip('destroy')
    }, 4000);
}


//Updates the browsing tab with files that are available for streaming
v.showAvailableFilesToStream = function(data) {
    if (Object.keys(data).length > 0) {
        htmlString = "<table id='browsing-table'><thead><th>Filename</th><th>Uploaded By</th><th>Share Group</th><th>Download</th><th>Stream</th></thead><tbody>";
        var shareGroups = {};
        var fileIDs = {};
        var shareGroupIDs = {};
        var file_names = [];
        var file_types = {};
        var owner = {};
        $.each(data, function(i, f) {
            if (!shareGroups[f.name]) {
                shareGroups[f.name] = [];
                file_names.push(f.name);
                fileIDs[f.name] = f.id;
                file_types[f.name] = f.type;
                owner[f.name] = f.user;
            }
            shareGroups[f.name].push(f.shareGroup.name);
            shareGroupIDs[f.shareGroup.name] = f.shareGroup.id;
        });
        file_names.sort();
        file_names.forEach(function(f) {
            htmlString += "<tr><td>" + f + "<br><progress id='progress-bar' data-file-id='" + fileIDs[f] + "' max='100' value='0' style='display:none;'></progress><span id='inCaseClose-" + fileIDs[f] + "'></span>"
            htmlString += "</td><td>" + owner[f] + "</td><td>" + shareGroups[f].join(', ') + "</td>";
            htmlString += "<td><button class='download-button' name='" + f + "'data-file-id='" + fileIDs[f] + "' data-share-group-id='" + shareGroupIDs[shareGroups[f][0]] + "'>Download</button></td>";
            if (file_types[f] == 'audio/mp3' || file_types[f] == 'video/mp4') {
                htmlString += "<td><button class='stream-button' data-file-id='" + fileIDs[f] + "' data-share-group-id='" + shareGroupIDs[shareGroups[f][0]] + "'>Stream</button></td></tr>";
            } else {
                htmlString += "<td></td></tr>"
            }
        });
        htmlString += "</tbody></table>";
    } else {
        htmlString = "No files can be downloaded or streamed this moment."
    }
    $('#streamable-files').append(htmlString);
    $('#browsing-table').dataTable();
}


//This will update the Sharing tab to reflect all the currently sharing files.
v.showFilesCurrentlyBeingShared = function(data) {
    htmlString = "";
    if (data.length > 0) {
        var files = {};
        var fileIDs = {};
        var file_names = [];
        htmlString += "<table id='sharing-table'><thead><th>Filename</th><th>Share Groups</th><th>Edit</th></thead><tbody>";
        $.each(data, function(i, f) {
            if (!files[f.name]) {
                files[f.name] = [];
                file_names.push(f.name);
                fileIDs[f.name] = f.id;
            }
            files[f.name].push(f.shareGroup.name);
        });
        file_names.sort();
        file_names.forEach(function(f) {
            htmlString += "<tr class='sharedFile'><td>" + f + "</td><td>" + files[f].join(',') + "</td>";
            htmlString += "<td><button class='edit-file-button' data-file-id='" + fileIDs[f] + "'>Edit</button></td></tr>"
        });

        htmlString += "</tbody></table>";
    } else {
        htmlString += "No files being shared at this moment."
    }
    $('#shared-files').html(htmlString);
    $('#sharing-table').DataTable();
};
