// Configure initiate const 
const express = require('express');
const mysql = require('mysql');
const mysql2 = require('mysql2/promise');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const path = require('path');
const fs = require('fs').promises;
const { noCacheMiddleware } = require('./js/Middleware.js');////Configuration Header Response
const { checkSessionValidity } = require('./js/session_validate.js');
const noteController = require('./js/noteController');

const ping = require('ping');
/////Database const////
const dbQueries = require('./database/dbQueries');
//////Session const -> this help node.js hanlde the request part//// 
const cookieParser = require('cookie-parser');



///////////////// Configure MySQL connection ( MariaDB) ////////////////////////////////
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'rbbnpentest',
    password: '123abc!@#',
    database: 'db_account'
});

const db_2 = {
    host: '127.0.0.1',
    user: 'rbbnpentest',
    password: '123abc!@#',
    database: 'Collection'
};

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL - MariaDB');
});


/////------- Middleware--------------/////
 ////This middleware is responsible for parsing the incoming request bodies in x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true })) ///like request.username and request.password
app.use(session({ secret: '123', resave: true, saveUninitialized: true }));

///////---Data type modification / handle JSON type -----/////
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
/////------------Cache Configuration ----------------
app.use(cookieParser());////Must be put this function above that help node understand the cookie value
app.use(noCacheMiddleware);
/////////---Protection from Broken Authentication-------/////////
const protectedRoutes = ['/dashboard', '/user/profile'];
app.use(protectedRoutes, checkSessionValidity);




//////---------------Authentication phase------------------///////
/////Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;   
    // Check credentials in the database
    db.query(dbQueries.Auth_select_User, [username, password], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            // Store user in session
            req.session.user = username;    
            res.redirect('/dashboard');
        } else {
            res.send('Invalid login credentials');
        }
    });
});
////Logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/');
    });
});
/////////////Finish Authentication phase//////////

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++///
////////////////////////-------Set the static route for system------------//////////////////
/////This help us configure static path-> query the file ----------////
// Set the view engine to ejs .This is important for res.render
// Routes to the login pages
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
});
app.use('/dashboard', require('./routes/dashboard'));

app.set('view engine', 'ejs');  

// Set the views directory
app.set('views', path.join(__dirname, 'views'));



// Serve static files from the "static" directory
app.use('/static', express.static(path.join(__dirname, 'static')));

// Serve static files from the "js" directory
app.use('/js', express.static(path.join(__dirname, 'js')));

// Handle profile updates
app.use('/user', require('./routes/user'));

// Handle upload_file feature
app.use('/vuln/Upload_file', require('./Vuln/Upload_file/Upload_file'));

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++///
/////---------------------------XSS Configuration------------------------------------///////////
// Serve static files from the "/Vuln/XSS" directory -> thí help us load verifcation.js
app.use('/vuln/xss', express.static(path.join(__dirname, 'Vuln', 'XSS')));

/////XSS lab configuration
app.get('/vuln/XSS', async (req, res) => {
    try {
        // Serve HTML file
        const htmlFilePath = path.join(__dirname, 'Vuln/XSS', 'XSS.html');
        const htmlFileContent = await fs.readFile(htmlFilePath, 'utf-8');

        // Fetch comments
        const comments = await fetchComments();
        const commentsString = comments.map(comment => `ID: ${comment.id}, Comment: ${comment.comment}<br>`).join('');


        // Combine HTML content and comments
        const combinedContent = `${htmlFileContent}\nComment load Directly from SQL <br> ${commentsString}!`;

        // Send the combined content as the response
        res.send(combinedContent);
        // Log the result of fetchComments()
        console.log('Fetched comments:', comments);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching comments');
    }
});

app.post('/vuln/XSS/addComment', (req, res) => {
    // Extract the updated data from the form submission
    const XSS_id_comment = req.body.id;
    const XSS_comment = req.body.comment;

    // Update the user's data in the database (replace with your actual query)
    db.query(dbQueries.XSS_insert_comment, [XSS_id_comment, XSS_comment], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error updating comment data');
        } else {
            // Redirect to the updated profile page
            res.redirect('/vuln/XSS');
        }
    });
});

app.post('/vuln/XSS/deleteComment', (req, res) => {
    // Extract the updated data from the form submission
    const XSS_id_comment = req.body.id;

    const updateQuery = 'DELETE FROM comment WHERE id = ?;';
    db.query(dbQueries.XSS_delete_comment, [XSS_id_comment], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error updating delete comments');
        } else {
            // Redirect to the updated profile page
            res.redirect('/vuln/XSS');
        }
    });
});

app.get('/vuln/XSS_JSON', async (req, res) => {
    try {
        // Fetch comments
        const XSS_comments = await fetchComments();
        // Send comments as JSON in the response
        res.json({ XSS_comments });
        // Log the result of fetchComments()
        console.log('Fetched comments:', XSS_comments);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching comments');
    }
});

const fetchComments = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM comment';
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

////------------------------CMD Injection Configuration-----------------------////
////--------------Ping function------------------////
app.get('/vuln/CMDInjetion', async (req, res) => {
    try {
        // Serve HTML file
        const htmlFilePath = path.join(__dirname, 'Vuln/CMDInjetion', 'CMDIndex.html');
        const htmlFileContent = await fs.readFile(htmlFilePath, 'utf-8');

        // Combine HTML content and comments
        const combinedContent = `${htmlFileContent}`;
        // Send the combined content as the response
        res.send(combinedContent);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});
/////////This ping return JSON request///////////////
app.get('/ping', async (req, res) => {
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
  });

app.post('/readfile', express.text(), async (req, res) => {
    const filePath = req.body;  
    console.log(`File read : ${filePath}`);
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      res.send(fileContent);
    } catch (error) {
      res.status(500).send('Error reading the file.');
    }
  });
////---------------Config Note Feature Path------------------------------------////
app.use(bodyParser.json());

app.get('/note/note-taking.html', noteController.serveNotePage);
app.get('/note/options', noteController.fetchNoteOptions);
app.post('/note/saveNote', noteController.saveNote);
app.post('/note/fetchNote', noteController.fetchNote);
app.post('/note/deleteNote', noteController.clearNotesByType);

////------------------------End of perform any request-----------------------////

app.all('*', (req, res) => {
    return res.status(404).send({
        message: '404 page not found'
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


