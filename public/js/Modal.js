/**
 * The Modal class models a basic input and output dialog box.
 * The Modal is always instantiated with a model and view object.
 * When the modal is shown, it requires input data which will is used to
 * get the correct data to show.
 * When the modal completes it's task, it calls the callback that was passed to getData.
 */



var Modal = function Modal(model, view) {
    this.tmpCallback = {};
    this.model = model;
    this.view = view;
}


moa = Modal.prototype;


/**
 * This is called when the modal is being shown.
 * @param  {[Object]}   input_data [Data]
 * @param  {Function} callback   [description]
 * @return {[Boolean]}              [True]
 */
moa._showModalAndGetData = function(input_data, callback) {
    this.tmpCallback = callback;
    return true;
}

/**
 * This is called when the Modal is being closed.
 * If no output data is passed to the function, then the 
 * callbacjk is not called.
 * @param  {[Object]} output_data [Data]
 * @return {[Boolean]}             [True if callback is called, false otherwise]
 */
moa._closeModal = function(output_data) {
    if (output_data != undefined) {
        this.tmpCallback(output_data);
        this.tmpCallback = {};
        return true;
    };
    this.tmpCallback = {};
    return false;
}
