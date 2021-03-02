const app = require('../app');
const request = require('supertest');
const http = require('http-status-codes');
// const jest = require('jest');
const jwt = require('jsonwebtoken');


/* /boards는 토큰이 있어야 접근 권한을 갖는다  */
let token;

beforeAll((done) => {
  request(app)
    .post('/auth/login')
    .send({
      username: '1004',
      password: '1004',
    })
    .end((err, response) => {
      token = response.body.token; // save the token!
      done();
    });
});


/* Create */
describe('크리에잇 테스트', () => {
    // test('보드 등록 실패(로그인x)', async (done) => {
    //     const board = {
    //         title: "zzz"
    //     };
    //     const response = await request(app)
    //     .post('/boards').send(board);
    //     expect(response.status).toEqual(http.StatusCodes.UNAUTHORIZED);
    //     done();
    // });

    // test('보드 등록 성공(로그인o)', async (done) => {
    //     const board = {
    //         title: "zzz"
    //     };
    //     const response = await request(app)
    //     .post('/boards').send(board)
    //     .set('Authorization', `Bearer ${token}`);
    //     expect(response.status).toEqual(http.StatusCodes.CREATED);
    //     done();
    // });

    // test('리스트 등록 성공(로그인o)', async (done) => {
    //     const list = {
    //         board_id: "1",
    //         title: "zzz",
    //         index: "2"
    //     };
    //     const response = await request(app)
    //     .post('/boards/lists').send(list)
    //     .set('Authorization', `Bearer ${token}`);
    //     expect(response.status).toEqual(http.StatusCodes.CREATED);
    //     done();
    // });

    test('카드 등록 성공(로그인o)', async (done) => {
        const card = {
            list_id: "1",
            content: "zzz",
            index: "1"
        };
        const response = await request(app)
        .post('/boards/lists/cards').send(card)
        .set('Authorization', `Bearer ${token}`);
        expect(response.status).toEqual(http.StatusCodes.CREATED);
        done();
    });
});