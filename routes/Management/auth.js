const pool = require('../../database/dbConnection');
const express = require('express');
const app = express();
const dbQueries = require('../../database/dbQueries');

// Login route handler
exports.login = (req, res) => {
  const { username, password } = req.body;

  // Check credentials in the database
  const query = dbQueries.Auth_select_User;
  const values = [username, password];

  pool.query(query, values, (err, results) => {
    if (err) {
      console.error('Error executing query', err.stack);
      res.status(500).send('Internal server error');
      return;
    }

    if (results.rows.length > 0) {
      // Store user in session
      req.session.user = username;
      res.redirect('/dashboard');
    } else {
      res.send('Invalid login credentials');
    }
  });
};

// Logout route handler
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session', err.stack);
      res.status(500).send('Internal server error');
      return;
    }
    res.redirect('/');
  });
};