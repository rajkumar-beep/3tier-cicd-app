const request = require('supertest');
const app = require('../server');

describe('Auth Routes', () => {
  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
  test('POST /api/auth/register - missing fields returns 400', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'test@test.com' });
    expect(res.statusCode).toBe(400);
  });
  test('POST /api/auth/login - missing fields returns 400', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'test@test.com' });
    expect(res.statusCode).toBe(400);
  });
});
