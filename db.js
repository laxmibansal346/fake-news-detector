const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST?.trim(),
    user: process.env.DB_USER?.trim(),
    password: process.env.DB_PASSWORD?.trim(),
    database: process.env.DB_NAME?.trim()
});

db.connect((err) => {
    if(err) {
        console.log('Database connection failed:', err.message);
        return;
    }
    console.log('Database connected successfully!');
});

module.exports = db;