const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST?.trim(),
    user: process.env.DB_USER?.trim(),
    password: process.env.DB_PASSWORD?.trim(),
    database: process.env.DB_NAME?.trim(),
    port: process.env.DB_PORT?.trim(),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if(err) {
        console.log('Database connection failed:', err.message);
        return;
    }
    console.log('Database connected successfully!');
    connection.release();
});

module.exports = db;