const app = require('../app');
const request = require('supertest');

describe('Test /', () => {
    it ('should return index.html!', (done) => {
      request(app).get('/').then((response) => {
        expect(response.statusCode).toEqual(200);
        done();
      });
    });
  });