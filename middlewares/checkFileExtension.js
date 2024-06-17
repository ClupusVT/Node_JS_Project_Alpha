const multer = require('multer');

// Create storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Custom middleware to check file extension
function checkFileInput_Serverside(req, res, next) {
    
    // Check if the file is present in the request
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Get the file extension
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();

    // Define allowed file extensions
    const allowedExtensions = ['txt', 'pdf', 'doc', 'docx'];

    // Check if the file extension is allowed
    if (!allowedExtensions.includes(fileExtension)) {
        return res.status(400).json({ error: 'Invalid file typed detected by server side. Allowed types: txt, pdf, doc, docx.' });
    }


    // Validate filename length
    const maxFilenameLength = 15; // Set your desired maximum filename length
    if (req.file.originalname.length > maxFilenameLength) {
        return res.status(400).json({ error: 'Filename is too long.' });
    }
    //console.log("valid input");
    // File is valid, continue to the next middleware or route handler
    next();
}

// Middleware to handle file uploads
const handleFileUpload = upload.single('file');

module.exports = { handleFileUpload, checkFileInput_Serverside };
