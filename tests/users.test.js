const app = require('../app');
const request = require('supertest');

/* 회원 가입 */
describe('유저 테스트', () => {
    test('가입', async (done) => {
        //아이디가 중복되면 에러
        const user = {
            username: "saaavv",
            email: "123@1a2s3.com",
            password: "description"
        };
        const response = await request(app)
        .post('/users').send(user);
        expect(response.status).toEqual(200);
        expect(response.body.message).toBe('success');
        done();
    });
    test('로그인', async (done) => {
        //아이디가 중복되면 에러
        const user = {
            username: "saaavv",
            password: "description"
        };
        const response = await request(app)
        .post('/users/login').send(user);
        expect(response.status).toEqual(200);
        // expect(response.body.token).toBe('success');
        done();
    });
});
