// ==========================================================
// TESTS POUR L'APPLICATION EXPRESS
// ==========================================================

const request = require('supertest');
const app = require('../app');

// ==========================================================
// TEST 1 - Route GET /hello
// ==========================================================

describe('GET /hello', () => {
  test('devrait retourner Hello World', async () => {
    const response = await request(app).get('/hello');
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Hello World' });
  });
});

// ==========================================================
// TEST 2 - Route GET /hello/:name
// ==========================================================

describe('GET /hello/:name', () => {
  test('devrait retourner un message personnalisé', async () => {
    const response = await request(app).get('/hello/Alice');
    
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Hello Alice!');
  });
  
  test('devrait gérer les noms avec espaces', async () => {
    const response = await request(app).get('/hello/Jean%20Dupont');
    
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Hello Jean Dupont!');
  });
});

// ==========================================================
// TEST 3 - Route POST /calculate
// ==========================================================

describe('POST /calculate', () => {
  test('devrait additionner deux nombres', async () => {
    const response = await request(app)
      .post('/calculate')
      .send({ a: 5, b: 3 })
      .set('Content-Type', 'application/json');
    
    expect(response.statusCode).toBe(200);
    expect(response.body.result).toBe(8);
  });
  
  test('devrait retourner une erreur pour entrées invalides', async () => {
    const response = await request(app)
      .post('/calculate')
      .send({ a: 'cinq', b: 3 })
      .set('Content-Type', 'application/json');
    
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('a et b doivent être des nombres');
  });
  
  test('devrait gérer les nombres négatifs', async () => {
    const response = await request(app)
      .post('/calculate')
      .send({ a: -5, b: 3 })
      .set('Content-Type', 'application/json');
    
    expect(response.statusCode).toBe(200);
    expect(response.body.result).toBe(-2);
  });
});