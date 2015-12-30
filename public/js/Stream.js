/**
 * The stream class is used to initiate a stream of a file from a source to destination.
 * Usually, the server returns the required arguments of the constructor after
 * being sent a StreamRequest object. 
 */

var Stream = function Stream(source, destination, file_id, download) {
    this.source = source;
    this.destination = destination;
    this.file_id = file_id;
    this.download = download;
}
