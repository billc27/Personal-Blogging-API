// Express Server
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

const createDatabase = require('./models/initDb');

// Initialize database
createDatabase().then(() => {
    // Recreate the connection pool with the database specified
    const mysql = require('mysql2');
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    // Export the new pool
    module.exports = pool.promise();

    // Import routes after the database is initialized
    const articleRoutes = require('./routes/articleRoutes');

    // Hit: ../articles/..
    app.use('/articles', articleRoutes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch (err => {
    console.error('Error initializing database:', err);
});

module.exports = app;
