// dbQueries.js this command interact with MariaDB////
///Database command realted to Authentication Part 
module.exports = {
    Auth_select_User: 'SELECT * FROM users WHERE username = ? AND password = ?',
    Auth_select_role: 'SELECT role FROM users WHERE username = ?',
    Auth_insert_user: 'INSERT INTO users (username, password) VALUES (?, ?)',
    Auth_select_email: 'SELECT email FROM users WHERE username = ?',
    Auth_update_users: 'UPDATE users SET full_name = ?, email = ? WHERE username = ?'
};
////


