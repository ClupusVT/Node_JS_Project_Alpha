// upload_validate.js . this vaildate only useful in the client side
///////this function validate from the period to select file , and could be intercerted
function validateFile() {
    // Get the selected file
    const fileInput = document.getElementById('file');
    const selectedFile = fileInput.files[0];

    // Check if a file is selected
    if (!selectedFile) {
        document.getElementById('file-error').innerText = 'Please choose a file.';
        return false;
    }

    // Get the file extension
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

    // Define allowed file extensions
    const allowedExtensions = ['txt', 'pdf', 'doc', 'docx'];

    // Check if the file extension is allowed
    if (!allowedExtensions.includes(fileExtension)) {
        document.getElementById('file-error').innerText = 'Invalid file type. Allowed types: txt, pdf, doc, docx. ';
        return false;
    }

    // Clear any previous error messages
    document.getElementById('file-error').innerText = '';

    // File is valid
    return true;
}
////checking will happen after we try submit button 
function validateForm() {
    // Get the selected file
    const fileInput = document.getElementById('file');
    const selectedFile = fileInput.files[0];

    // Check if a file is selected
    if (!selectedFile) {
        document.getElementById('file-error').innerText = 'Please choose a file with suitablte type.';
        return false;
    }

    // Get the file extension
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

    // Define allowed file extensions
    const allowedExtensions = ['txt', 'pdf', 'doc', 'docx'];

    // Check if the file extension is allowed
    if (!allowedExtensions.includes(fileExtension)) {
        document.getElementById('file-error').innerText = 'You have input invalid file type. Please change';
        return false;
    }

    // Clear any previous error messages
    document.getElementById('file-error').innerText = '';

    // Form is valid, continue with submission
    return true;
}