const db = require('../models/db');

const getAllArticles = async(req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM articles'
        );
        res.json(rows);
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const getArticleById = async (req, res) => {
    try {
        const[rows] = await db.query(
            'SELECT * FROM articles WHERE id = ?', 
            [req.params.id]
        );

        // Article Not Found
        if (rows.length === 0) {
            return res.status(404).json({
                message: 'Article not found'
            })
        };
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const createArticle = async (req, res) => {
    const { title, content, tags } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO articles (title, content, tags) VALUES (?, ?, ?)', 
            [title, content, tags]
        );
        res.status(201).json({
            id: result.insertId,
            title: title,
            content: content,
            tags: tags
        });
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};

const updateArticle = async (req, res) => {
    const { title, content, tags } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE articles SET title = ?, content = ?, tags = ? WHERE id = ?', 
            [title, content, tags, req.params.id]
        );
        
        // Nothing was updated
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Article not found'
            });
        }

        res.json({
            message: 'Article updated'
        });
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};

const deleteArticle = async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM articles WHERE id = ?', [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Article not found'
            });
        };
    
        res.json({
            message: 'Article deleted'
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const deleteArticleByTitle = async(req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM articles where title = ?', [req.body.title]
        );
    
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Article not found'
            });
        };
    
        res.json({
            message: 'Article deleted'
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

module.exports = {
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    deleteArticleByTitle
}
