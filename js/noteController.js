const mysql2 = require('mysql2/promise');
const path = require('path');
const fs = require('fs').promises;


const db_2 = {
    host: '127.0.0.1',
    user: 'rbbnpentest',
    password: '123abc!@#',
    database: 'Collection'
};


async function serveNotePage(req, res) {
    try {
        const htmlFilePath = path.join(__dirname, '../helpers/Feature', 'note-taking.html');
        const htmlFileContent = await fs.readFile(htmlFilePath, 'utf-8');
        const combinedContent = `${htmlFileContent}`;
        res.send(combinedContent);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
}

async function fetchNoteOptions(req, res) {
    const connection = await mysql2.createConnection(db_2);
    try {
        const [rows] = await connection.execute('SELECT DISTINCT Type FROM Note;');
        const values = rows.map(row => row.Type);
        res.json(values);
    } catch (error) {
        console.error('Error executing query:', error);
    } finally {
        connection.end();
    }
}

async function saveNote(req, res) {
    let connection;
    try {
        connection = await mysql2.createConnection(db_2);
        const content = req.body.noteContent;
        const type = req.body.optionsSelect_value;
        const query = 'INSERT INTO Note (Content, Type) VALUES (?, ?);';
        await connection.execute(query, [content, type]);
        res.send('<script>alert("Note added successfully")</script>');
    } catch (err) {
        console.error('Error inserting note:', err);
        res.status(500).send('Error inserting note');
    } finally {
        if (connection) {
            connection.end();
        }
    }
}

async function fetchNote(req, res) {
    let connection;
    try {
        connection = await mysql2.createConnection(db_2);
        const type = req.body.optionsSelect_value;
        const query = 'SELECT * FROM Note WHERE Type = (?);';
        const [result] = await connection.execute(query, [type]);
        res.json(result);
    } catch (err) {
        console.error('Error fetching note:', err);
        res.status(500).send('Error fetching note');
    } finally {
        if (connection) {
            connection.end();
        }
    }
}

async function clearNotesByType(req, res) {
    let connection;
    try {
        connection = await mysql2.createConnection(db_2);
        const type = req.body.optionsSelect_value;
        const query = 'DELETE FROM Note WHERE Type = ?;';
        await connection.execute(query, [type]);
        res.send(`All notes with type '${type}' cleared successfully`);
    } catch (err) {
        console.error('Error clearing notes by type:', err);
        res.status(500).send('Error clearing notes by type');
    } finally {
        if (connection) {
            connection.end();
        }
    }
}

module.exports = {
    serveNotePage,
    fetchNoteOptions,
    saveNote,
    fetchNote,
    clearNotesByType
};
