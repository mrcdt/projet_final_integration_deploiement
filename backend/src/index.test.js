const request = require('supertest');
const app = require('./index');

describe('API Tests', () => {
  test('GET /health retourne 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});