const request = require('supertest');
const app = require('../app');
const db = require('../models/db');

/**
 * Jest: For defining teet suites (describe, it, assertions (expect), setup/teardown functions (beforeAll, afterAll))
 * Supertest: For making HTTP requests to the express app (request(app).get('/articles'))
 */

// Setup
beforeAll(async () => {
    await db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await db.query(`USE ${process.env.DB_NAME}`);
    await db.query(`
        CREATE TABLE IF NOT EXISTS articles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            tags VARCHAR(255),
            publishedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

afterAll(async () => {
    await db.query('DROP TABLE IF EXISTS articles');
    await db.end();
});

// Test Suite
describe('GET /articles', () => {
    it('should return all articles', async() => {
        const res = await request(app).get('/articles');
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });
});

describe('POST /articles', () => {
    it('should create a new article', async() => {
        const newArticle = {
            title: "New Article",
            content: "This is a new article",
            tags: "test"
        }
        const res = await request(app).post('/articles').send(newArticle);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe(newArticle.title);
    });
});

describe('GET /articles/:id', () => {
    it('should return an article by id', async() => {
        const reqId = 1;
        const res = await request(app).get(`/articles/${reqId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', reqId);
    });
});

describe('PUT /articles/:id', () => {
    it('should update an article by id', async() => {
        const updatedArticle = {
            title: "Updated Article",
            content: "This is a new article",
            tags: "test"
        };
        const reqId = 1;
        const res = await request(app).put(`/articles/${reqId}`).send(updatedArticle);
        expect(res.statusCode).toBe(200);
    });
});

describe('DELETE /articles/:id', () => {
    it('should delete an article by id', async() => {
        const reqId = 1;
        const res = await request(app).delete(`/articles/${reqId}`);
        expect(res.statusCode).toBe(200);
    })
})

describe('DELETE /articles/by-title', () => {
    it('should delete an article by title', async() => {
        const newArticle = {
            title: "To Be Deleted Article",
            content: "This is a new article",
            tags: "test"
        }
        await request(app).post('/articles').send(newArticle);

        const body = {
            title: "To Be Deleted Article"
        }
        const res = await request(app).delete('/articles/by-title').send(body);
        expect(res.statusCode).toBe(200);
    })
})
