$(function(){

	$("#fileUploadImage").fileinput({
		// showUpload: false,
		uploadUrl: "/fileupload/",
		allowedFileExtensions: ["jpg", "png", "gif"],
		maxFileCount: 3,
	    validateInitialCount: true,
	    overwriteInitial: false
	}).on('filepreupload', function() {
	    // $('#kv-success-box').html('');
	}).on('fileuploaded', function(event, data) {
		console.log(data);
	    // $('#kv-success-box').append(data.response.link);
	    // $('#kv-success-modal').modal('show');
	});
});