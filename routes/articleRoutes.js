const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

// Rules: Specific rules before general

// Route for deleting an article by title
router.delete('/by-title', articleController.deleteArticleByTitle);

router.route('/')
    .get(articleController.getAllArticles)
    .post(articleController.createArticle);

// Route for handling articles by ID
router.route('/:id')
    .get(articleController.getArticleById)
    .put(articleController.updateArticle)
    .delete(articleController.deleteArticle);

module.exports = router;
