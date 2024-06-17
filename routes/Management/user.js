const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbQueries = require('../../database/dbQueries');


const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'rbbnpentest',
    password: '123abc!@#',
    database: 'db_account'
});

// Route to handle user input (POST request)
router.post('/addUser', (req, res) => {
    const { username, password } = req.body;
      // Use a parameterized query to prevent SQL injection
    db.query(dbQueries.Auth_insert_user, [username, password], (err, result) => {
      if (err) {
        handleError(res, err, 'Error inserting user');
      } else {
        res.send('User added successfully');
      }
    });
  });
  
  // Profile route (GET request)
router.get('/profile', (req, res) => {
    if (req.session.user) {
      const username = req.session.user;
  
      // Replace the following with your actual query to fetch user details
      db.query(dbQueries.Auth_select_email, [username], (err, result) => {
        if (err) {
          handleError(res, err, 'Error fetching user details');
        } else if (result.length > 0) {
          const userEmail = result[0].email;
  
          // Render the profile page with user details
          res.render('profile', { username, userEmail });
        } else {
          res.status(404).send('User not found');
        }
      });
    } else {
      res.redirect('/');
    }
  });

router.post('/update_profile', (req, res) => {
    // Extract the updated data from the form submission
    const newFullName = req.body.newFullName;
    const newEmail = req.body.newEmail;
    const current_username = req.body.username;

    // Update the user's data in the database (replace with your actual query)
    db.query(dbQueries.Auth_update_users, [newFullName, newEmail, current_username], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error updating user data');
            res.redirect('/user/profile');
        } else {
            // Redirect to the updated profile page
            res.redirect('/user/profile');
        }
    });
});
  
module.exports = router;