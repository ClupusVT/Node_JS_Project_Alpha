// dbQueries.js this command interact with PostgresSQL////
///Database command realted to Authentication Part 
module.exports = {
    Auth_select_User: 'SELECT * FROM db_account.account WHERE username = $1 AND password = $2',
    Auth_select_role: 'SELECT role FROM db_account.account WHERE username = $1',
    Auth_insert_user: 'INSERT INTO db_account.account (username, password) VALUES (?, ?)',
    Auth_select_email: 'SELECT email FROM db_account.account WHERE username = ?',
    Auth_update_users: 'UPDATE db_account.account SET full_name = ?, email = ? WHERE username = ?'
};
////


