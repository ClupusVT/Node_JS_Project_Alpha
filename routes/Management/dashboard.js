const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const path = require('path');
const pool = require('../../database/dbConnection');
const dbQueries = require('../../database/dbQueries');

router.get('/', (req, res) => {
  if (req.session.user) {
    const username = req.session.user;

    // Check user role in the database
    const query = dbQueries.Auth_select_role;
    const values = [username];

    pool.query(query, values, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error fetching user role');
      } else if (result.rows.length > 0) {
        const userRole = result.rows[0].role;
        ejs.renderFile(path.join(__dirname, '../../views/Management/User/dashboard.ejs'), { username, userRole }, (err, str) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error rendering dashboard template');
          } else {
            res.send(str);
          }
        });
      } else {
        res.status(404).send('User not found');
      }
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;