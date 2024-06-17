// Configure initiate const 
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const path = require('path');
const fs = require('fs').promises;
const { noCacheMiddleware } = require('./middlewares/Middleware.js');////Configuration Header Response
const { checkSessionValidity } = require('./middlewares/session_validate.js');
const noteController = require('./middlewares/noteController');
const authRoutes = require('./routes/Management/auth.js'); // Import the auth module
const xssRoutes = require('./routes/Vuln/XSS/xssRoutes.js');
const cmdInjectionRoutes = require('./routes/Vuln/CMDInjection/cmdinjectionroute.js');

//////Session const -> this help node.js hanlde the request part//// 
const cookieParser = require('cookie-parser');


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
const protectedRoutes = ['/dashboard', '/user/'];
app.use(protectedRoutes, checkSessionValidity);


//////---------------Authentication phase------------------///////
/////Login
app.post('/login', authRoutes.login);
app.get('/logout', authRoutes.logout);
/////////////Finish Authentication phase//////////

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++///
app.set('view engine', 'ejs');  
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/public/login.html');
});
app.use('/dashboard', require('./routes/Management/dashboard.js'));
// Set the views directory
app.set('views', path.join(__dirname, 'views'));
// Serve static files from the "static" directory
app.use('/static', express.static(path.join(__dirname, 'static')));

app.use('/middlewares', express.static(path.join(__dirname, 'middlewares')));
// Serve static files from the "static" directory
// Handle profile updates
app.use('/user', require('./routes/Management/user.js'));

/////---------------------------Vuln routing Configuration------------------------------------///////////
app.use('/vuln/XSS', xssRoutes);
app.use('/vuln/CMDInjection', cmdInjectionRoutes);

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


