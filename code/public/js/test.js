var testController = new Controller(location.hostname,9000);
var m = testController.model;
localStorage.removeItem("username");


asyncTest("Tests for SEG2105 Project", function( assert ) {
  expect( 12 );      	
  m.getFilesFromUser("!!@#SDRY%^*^DFGSD@#A", function(data) {
  		equal(data.length, 0, "Returns no files when requesting from non-existent user.");  		  		
   });

  // login user
  m.loginUser("testingThisUsername", function(data) {		  		
  		equal(data['success'], true, "Successfully logged in with arbitrary user.");		
   });

  // login user 2
  m.loginUser("testingThisUsername2", function(data) {		  		
  		equal(data['success'], true, "Successfully logged in with second arbitrary user.");		
   });

  // create a share group
  m.createShareGroup("testingShareGroup", function(d) {  	
  	equal(d['success'], true, "Successfully created a share group.");
  });

  //add users to share group
  m.addUsersToShareGroup(['testingThisUsername2', 'testingThisUsername'], 1, function(d) {  	
  	equal(d[1]['username'], 'testingThisUsername2', "Successfully added users to previously created share group.");
  });

  // upload a file to global share group
  var data = {};
  data['files'] = {'0':
  	{	'name': 'style.css',
  		'type': 'text/css',
  		'size':3381
  	}, 'length':1};
  data['shareGroups'] = ['0'];
  data['username_to_add_to'] = 'testingThisUsername';  
  m.notifyServerOfClientsFiles(data, function(data) {  	
  	equal(data[0].name, 'style.css', "Successfully uploaded a file to global share group.");
  });
  
  // retreive file  
  m.getCurrentlySharedFiles("testingThisUsername", function(data) {  	  	  	
  	equal(data[0].name, 'style.css', "Successfully retrieve previously uploaded file.");
  });

  // update file share groups
  var data = {'id':'da232d78aa810382f2dcdceae308ff8e', 'shareGroups':['0','1'],'username' : 'testingThisUsername'};
  m.updateFileWithShareGroup(data, function(data) {
  		equal(data['removed'], false, "Successfully updated share group for a file.");
  });

  // check if user 2 can access user 1's file
  m.getBrowsableFilesForUser({'username':"testingThisUsername2"}, function(data) {  		
  		equal(data[0]['name'], 'style.css', "A user successfully accessed another user's uploaded file.");
  });  

   // remove a file  (todo)
  var fileData = {'id':'da232d78aa810382f2dcdceae308ff8e', 'shareGroups':[],'username' : 'testingThisUsername'};
  m.updateFileWithShareGroup(fileData, function(d) {  		
  		equal(d['removed'], true, "Successfully removed a file.");  		
  });  

  // logout testing user
  m.logoutUser("testingThisUsername", function(data) {		  		
  		equal(data['success'], true, "Successfully logged out with arbitrary user.");		  		
   });

   // logout testing user
  m.logoutUser("testingThisUsername2", function(data) {		  		
  		equal(data['success'], true, "Successfully logged out with second arbitrary user.");		  		
   });
});