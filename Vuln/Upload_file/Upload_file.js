const express = require('express');
const multer = require('multer');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { handleFileUpload, checkFileInput_Serverside } = require('../../helpers/checkFileExtension');
const app = express();


// Constants for better maintainability
// Serve static files from the 'static' directory
app.use('/static', express.static(path.join(__dirname, 'static')));

const UPLOAD_DIRECTORY = 'Vuln/Upload_file/Files/';

const EJS_FILE_PATH = path.join(__dirname, 'Upload_file.ejs'); // Update the EJS file path

async function readFileContent(filePath) {
    try {
        const contentFile = await fs.readFile(filePath, 'utf-8');
        return contentFile;
    } catch (error) {
        console.error(`Error reading file: ${filePath}`, error);
        throw error; // You can handle the error as needed, e.g., return a default value
    }
}



// Serve EJS file which saved in view folder
router.get('/', async (req, res) => {
    try {
        //const ejsFileContent = await readEjsFile(EJS_FILE_PATH);
        uploadedFile = null
        uploadedFiles = null
        contentFile = null
        res.render('Upload_file.ejs', { uploadedFile, uploadedFiles }); ///ejs file shoud be put all in folder view 
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

// Redirect action route
router.get('/action', (req, res) => {
    res.redirect('/vuln/Upload_file');
});

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIRECTORY);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Handle file upload
router.post('/upload', handleFileUpload, checkFileInput_Serverside, (req, res) => {
    const uploadedFile = req.file;
    res.render('Upload_file.ejs', { uploadedFile });
});

/////////List the whole file 
router.get('/list', async (req, res) => {
    const uploadedFiles =[];
    try {
        // List all files in the specified folder
        const files = await fs.readdir(UPLOAD_DIRECTORY);
     
        // Pass the list of files to the EJS template
        res.render('Upload_file.ejs', {uploadedFiles:files});
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

/////Read the specific file 
router.post('/readfile', (req, res) => {
    const { filename } = req.body;
    const filePath = path.join(UPLOAD_DIRECTORY, filename);

    readFileContent(filePath)
        .then(contentFile => {
            res.render('Upload_file.ejs', { contentFile });
        })
        .catch(error => {
            if (error.code === 'ENOENT') {
                // File not found (ENOENT)
                res.status(404).send(`File not found`);
            } else {
                // Other error, respond with a generic error message
                res.status(500).send('Internal Server Error');
            }
        });
});

router.all('*', (req, res) => {
  
    res.status(404).sendFile(path.join(__dirname, '../../views', '404.html'));
});

module.exports = router;
