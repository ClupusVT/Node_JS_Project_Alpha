const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const mysql = require('mysql');
const dbQueries = require('../database/dbQueries');
const path = require('path');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'rbbnpentest',
    password: '123abc!@#',
    database: 'db_account'
});

router.get('/', (req, res) => {
    if (req.session.user) {      
        const username = req.session.user;
        db.query(dbQueries.Auth_select_role, [username], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error fetching user role');
            } else if (result.length > 0) {
                const userRole = result[0].role;
                ejs.renderFile(path.join(__dirname, '../views/dashboard.ejs'), { username, userRole }, (err, str) => {
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