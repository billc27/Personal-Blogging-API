const db = require('./db');

const createDatabase = async() => {
    try {
        await db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        await db.query(`USE ${process.env.DB_NAME}`);
        await db.query('DROP TABLE IF EXISTS articles');
        await db.query(
            `CREATE TABLE IF NOT EXISTS articles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                tags VARCHAR(255),
                publishedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`
        );

        console.log('Database and table created succesfully');
    } catch (err) {
        console.error('Error creating database or table:', err);
    }
};

module.exports = createDatabase;
