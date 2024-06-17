const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const dbQueries = require('../../../database/dbQueries'); // Assuming you have a module with database queries
const pool = require('../../../database/dbConnection');

const router = express.Router();


// Serve static files from the "/Vuln/XSS" directory -> this helps us load verification.js
router.use('/', express.static(path.join(__dirname, 'views','Vuln', 'XSS')));

// Fetch comments function
const fetchComments = async () => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM comment');
        client.release();
        return result.rows;
    } catch (error) {
        throw error;
    }
};

// XSS route
router.get('/', async (req, res) => {
    try {
        // Serve HTML file
        const htmlFilePath = path.join(__dirname, '../../../Vuln/XSS', 'XSS.html');
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

// Add comment route
router.post('/vuln/XSS/addComment', async (req, res) => {
    // Extract the updated data from the form submission
    const XSS_id_comment = req.body.id;
    const XSS_comment = req.body.comment;

    try {
        const client = await pool.connect();
        await client.query('INSERT INTO comment (id, comment) VALUES ($1, $2)', [XSS_id_comment, XSS_comment]);
        client.release();
        res.redirect('/vuln/XSS');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating comment data');
    }
});

// Delete comment route
router.post('/vuln/XSS/deleteComment', async (req, res) => {
    // Extract the updated data from the form submission
    const XSS_id_comment = req.body.id;

    try {
        const client = await pool.connect();
        await client.query('DELETE FROM comment WHERE id = $1', [XSS_id_comment]);
        client.release();
        res.redirect('/vuln/XSS');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating delete comments');
    }
});

// JSON route
router.get('/vuln/XSS_JSON', async (req, res) => {
    try {
        // Fetch comments
        const comments = await fetchComments();
        // Send comments as JSON in the response
        res.json({ comments });
        // Log the result of fetchComments()
        console.log('Fetched comments:', comments);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching comments');
    }
});

module.exports = router;

module.exports = router;
