// const app = require('../app');
// const request = require('supertest');
// const http = require('http-status-codes');

// /* 
// /auth/join,
// auth/login 
//  */
// describe('유저 테스트', () => {
//     test('가입', async (done) => {
//         //아이디가 중복되면 에러
//         const user = {
//             username: "11wsss",
//             email: "q12@23ㄴdas.com",
//             password: "aaaa"
//         };
//         const response = await request(app)
//         .post('/auth/join').send(user);
//         expect(response.status).toEqual(http.StatusCodes.BAD_REQUEST);
//         done();
//     });

//     // test('가입', async (done) => {
//     //     //입력이 부족하면 에러(이메일 작성 X)
//     //     const user = {
//     //         username: "qaaaa",
//     //         password: "aaaa"
//     //     };
//     //     const response = await request(app)
//     //     .post('/auth/join').send(user);
//     //     console.log(response.body.message);
//     //     expect(response.status).toEqual(http.StatusCodes.BAD_REQUEST);
//     //     done();
//     // });



//     // test('로그인', async (done) => {
//     //     const user = {
//     //         username: 'aaaa',
//     //         password: 'aaaa'
//     //     };
//     //     const response = await request(app)
//     //     .post('/auth/login').send(user);
//     //     expect(response.status).toEqual(200);
//     //     // expect(response.body.token).toBe('success');
//     //     done();
//     // });


// });
