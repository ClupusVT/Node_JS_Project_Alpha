const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const ping = require('ping');

const router = express.Router();
const readFileByCommand = require('../../../middlewares/fileReader_sanity');
const isFilePathAllowed = require('../../../middlewares/fileReader_sanity');


//Serve HTML file for CMD Injection
const serveCMDInjectionHTML = async (req, res) => {
    try {
        // Construct the path to CMd2.html
        const htmlFilePath = path.join(__dirname,'..','..','..', 'views', 'Vuln', 'CMDInjection', 'CMDIndex.html');

        // Read the HTML file
        const htmlFileContent = await fs.readFile(htmlFilePath, 'utf-8');

        // Send the HTML content as the response
        res.send(htmlFileContent);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
};

// Ping function route
const pingHost = async (req, res) => {
    const { host } = req.query;
  
    if (!host) {
      return res.status(400).json({ error: 'Missing host parameter' });
    } 
    try {
      const result = await ping.promise.probe(host);
      res.json({ result });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Read file route
const readFileContent_express = async (req, res) => {
    const filePath = req.body;  
    console.log(`File read : ${filePath}`);
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      res.send(fileContent);
    } catch (error) {
      res.status(500).send('Error reading the file.');
    }
};

const readFileContent_bycmd = async (req, res) => {
    const filePath = req.body.filePath; // Assuming req.body contains a property named 'filePath' with the file path as a string
    if (!filePath) {
        res.status(400).send('File path is missing with L2.');
        return;
    }

    const fileContent = await readFileByCommand(filePath);
    res.send(fileContent);
  };
  
const readFileContent_bycmd_L3 = async (req, res) => {
  const filePath = req.body.filePath; // Assuming req.body contains a property named 'filePath' with the file path as a string
  if (!filePath) {
      res.status(400).send('File path is missing with L3.');
      return;
  }
  const allowedDirectory = 'C:\\Users\\nmanhthi';
  try {
      const isAllowed = await isFilePathAllowed(filePath, allowedDirectory);
      if (!isAllowed) {
          console.log('File path is not allowed.');
          res.status(403).send('File path is not allowed.');
          return;
      }
      console.log('File path is correct.');
      // Assuming readFileByCommand is an asynchronous function that returns a Promise
      const fileContent = await readFileByCommand(filePath);
      res.send(fileContent);
  } catch (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).send('Internal server error.');
  }
};



// Define routes
router.get('/', serveCMDInjectionHTML);
router.get('/ping', pingHost);
router.post('/readfile', express.text(), readFileContent_express);
router.post('/readfile_bycmd', readFileContent_bycmd);
router.post('/readfile_bycmd_L3', readFileContent_bycmd_L3);

module.exports = router;
