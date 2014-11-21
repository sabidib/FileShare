
$(function() {
    var socket = io();    
      
    var client = new BinaryClient('ws://'+location.hostname+':9000');
  

    client.on('open', function(){
        var box = $('#box');
        box.on('dragenter', doNothing);
        box.on('dragover', doNothing);
        box.text('Drag files here');
        box.on('drop', function(e){
            e.originalEvent.preventDefault();                    
            var file = e.originalEvent.dataTransfer.files[0];                    
            // Add to list of uploaded files
            $('<div align="center"></div>').append($('<a></a>').text(file.name).prop('href', '/'+file.name)).appendTo('body');
                
                // `client.send` is a helper function that creates a stream with the 
                // given metadata, and then chunks up and streams the data.
                var filePath = "/"; // need to somehow get file path
                var stream = client.send(file, {name: file.name, size: file.size, type:file.type, path:filePath});
                
                // Print progress
                var tx = 0;
                stream.on('data', function(data){
                $('#progress').text(Math.round(tx+=data.rx*100) + '% complete');
             });
          }); 
    });
    
    // Received new stream from server!
client.on('stream', function(stream, meta){    
  // Buffer for parts
  var parts = [];
  // Got new data
  stream.on('data', function(data){            
    parts.push(data);
  });
  stream.on('end', function(){
    // Display new data in browser!
    var img = document.createElement("img");
    img.src = (window.URL || window.webkitURL).createObjectURL(new Blob(parts));
    document.body.appendChild(img);

    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src',(window.URL || window.webkitURL).createObjectURL(new Blob(parts)));
    audioElement.setAttribute('type','audio/mpeg');
    audioElement.play();
  });
});


    // Deal with DOM quirks
    function doNothing (e){
      e.preventDefault();
      e.stopPropagation();
    }



var c = new Controller();

  
});   



