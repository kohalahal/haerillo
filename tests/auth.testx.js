const app = require('../app');
const request = require('supertest');
const http = require('http-status-codes');
const models = require("../models");

afterAll(() => models.sequelize.close());

test('유저네임 중복체크 겟', async (done) => {
    const username = "1004";
    const response = await request(app)
    .get('/auth/username/'+username);
    expect(response.status).toEqual(http.StatusCodes.OK);
    console.log("유저네임 중복체크 결과"+response.body.message);
    done();
});

test('이메일 중복체크 겟', async (done) => {
    const email = "a@a.a";
    const response = await request(app)
    .get('/auth/email/'+email);
    expect(response.status).toEqual(http.StatusCodes.OK);
    console.log("email 중복체크 결과"+response.body.message);
    done();
});