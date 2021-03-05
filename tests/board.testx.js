const app = require('../app');
const request = require('supertest');
// const mysql = require('mysql2');
const http = require('http-status-codes');
const jwt = require('jsonwebtoken');
const boardRouter = require('../routes/boards');
// const jest = require('jest');
const models = require("../models");


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

afterAll(() => models.sequelize.close());

// describe('보드 라우터 테스트', () => {
//   test('토큰에서 유저 아이디 가져오기', async (done) => {
//     let mockRequest = {};
//     mockRequest.headers = {};
//     mockRequest.headers.authorization = `Bearer ${token}`;
//     let userId = await boardRouter.getUserIdFromToken(mockRequest);
//     expect(userId).toEqual(52);
//     done();
//   });
// });

/* Create */
// describe('크리에잇 테스트', () => {
  // test('보드 등록 실패(로그인x)', async (done) => {
  //     const board = {
  //         title: "zzz"
  //     };
  //     const response = await request(app)
  //     .post('/boards').send(board);
  //     expect(response.status).toEqual(http.StatusCodes.UNAUTHORIZED);
  //     console.log(response.body.message);
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
  //     console.log(response.body.message);
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
  //     console.log(response.body.message);
  //     done();
  // });

  // test('카드 등록 성공(로그인o)', async (done) => {
  //     const card = {
  //         list_id: "1",
  //         content: "zzz",
  //         index: "1"
  //     };
  //     const response = await request(app)
  //     .post('/boards/lists/cards').send(card)
  //     .set('Authorization', `Bearer ${token}`);
  //     expect(response.status).toEqual(http.StatusCodes.CREATED);
  //     console.log(response.body.message);
  //     done();
  // });

    test('boards 겟 성공(로그인o)', async (done) => {
      const response = await request(app)
      .get('/boards')
      .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(http.StatusCodes.OK);
      console.log(response.body.message);
      done();
  });


// /* READ 테스트 */
// describe('read 테스트', () => {  
//     test('보드 겟 성공(로그인o)', async (done) => {
//       const response = await request(app)
//       .get('/boards')
//       .set('Authorization', `Bearer ${token}`);
//       expect(response.status).toEqual(http.StatusCodes.OK);
//       console.log(response.body.boards);
//       done();
//   });
// });

/* PUT 테스트 */
// describe('put 테스트', () => {  
  //   test('보드 등록 성공(로그인o)', async (done) => {
  //     const board = {
  //       title: "zzz"
  //     };
  //     const response = await request(app)
  //     .post('/boards').send(board)
  //     .set('Authorization', `Bearer ${token}`);
  //     expect(response.status).toEqual(http.StatusCodes.CREATED);
  //     console.log(response.body.message);
  //     done();
  // });
  // test('보드 풋 성공(로그인o)', async (done) => {
  //   const board = {
  //     title: "수정"
  //   };
  //   const response = await request(app)
  //   .put('/boards/55').send(board)
  //   .set('Authorization', `Bearer ${token}`);
  //   expect(response.status).toEqual(http.StatusCodes.OK);
  //     console.log(response.body.message);
  //   done();
  // });
  // test('리스트 등록 성공(로그인o)', async (done) => {
  //   const list = {
  //       board_id: "55",
  //       title: "zzz",
  //       index: "1"
  //   };
  //   const response = await request(app)
  //   .post('/boards/lists').send(list)
  //   .set('Authorization', `Bearer ${token}`);
  //   expect(response.status).toEqual(http.StatusCodes.CREATED);
  //   console.log(response.body.message);
  //   done();
  // });
  //   test('리스트 풋 성공(로그인o)', async (done) => {
  //   const list = {
  //     title: "수정222222",
  //     board_id: "55"
  //   };
  //   const response = await request(app)
  //   .put('/boards/lists/33').send(list)
  //   .set('Authorization', `Bearer ${token}`);
  //   expect(response.status).toEqual(http.StatusCodes.OK);
  //   console.log(response.body.message);
  //   done();
  // });
  //   test('카드 등록 성공(로그인o)', async (done) => {
  //     const card = {
  //         board_id: "55",
  //         list_id: "33",
  //         content: "ㄴㅇㄴㅇㄴㅇㄴㅇㄴㅇ",
  //         index: "1"
  //     };
  //     const response = await request(app)
  //     .post('/boards/lists/cards').send(card)
  //     .set('Authorization', `Bearer ${token}`);
  //     expect(response.status).toEqual(http.StatusCodes.CREATED);
  //     console.log(response.body.message);
  //     done();
  // });

  // test('카드 풋 성공(로그인o)', async (done) => {
  //   const card = {
  //     content: "수정",
  //     board_id: "55",
  //     list_id: "33"
  //   };
  //   const response = await request(app)
  //   .put('/boards/lists/cards/103').send(card)
  //   .set('Authorization', `Bearer ${token}`);
  //   expect(response.status).toEqual(http.StatusCodes.OK);
  //   console.log(response.body.message);
  //   done();
  // });
// });

/* delete 테스트 */
// describe('delete 테스트', () => {  
  //   test('보드 등록 성공(로그인o)', async (done) => {
  //     const board = {
  //       title: "삭제"
  //     };
  //     const response = await request(app)
  //     .post('/boards').send(board)
  //     .set('Authorization', `Bearer ${token}`);
  //     expect(response.status).toEqual(http.StatusCodes.CREATED);
  //     console.log(response.body.message);
  //     done();
  // });
  
  // test('리스트 등록 성공(로그인o)', async (done) => {
  //   const list = {
  //       board_id: "57",
  //       title: "삭제",
  //       index: "2"
  //   };
  //   const response = await request(app)
  //   .post('/boards/lists').send(list)
  //   .set('Authorization', `Bearer ${token}`);
  //   expect(response.status).toEqual(http.StatusCodes.CREATED);
  //   console.log(response.body.message);
  //   done();
  // });

    test('카드 등록 성공(로그인o)', async (done) => {
      const card = {
          board_id: "57",
          list_id: "36",
          content: "삭제",
          index: "3"
      };
      const response = await request(app)
      .post('/boards/lists/cards').send(card)
      .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(http.StatusCodes.CREATED);
      console.log(response.body.message);
      done();
  });


  // test('보드 delete 성공(로그인o)', async (done) => {
  //   const response = await request(app)
  //   .delete('/boards/56')
  //   .set('Authorization', `Bearer ${token}`);
  //   expect(response.status).toEqual(http.StatusCodes.OK);
  //   console.log(response.body.message);
  //   done();
  // });

  // test('리스트 delete 성공(로그인o)', async (done) => {
  //   const data = {
  //     board_id: "57"
  //   };
  //   const response = await request(app)
  //   .delete('/boards/lists/37').send(data)
  //   .set('Authorization', `Bearer ${token}`);
  //   expect(response.status).toEqual(http.StatusCodes.OK);
  //   console.log(response.body.message);
  //   done();
  // });

  // test('카드 delete 성공(로그인o)', async (done) => {
  //   const data = {
  //     board_id: "57"
  //   };
  //   const response = await request(app)
  //   .delete('/boards/lists/cards/107').send(data)
  //   .set('Authorization', `Bearer ${token}`);
  //   expect(response.status).toEqual(http.StatusCodes.OK);
  //   console.log(response.body.message);
  //   done();
  // });

  // test('보드 delete 실패(남의 보드)', async (done) => {
  //   const response = await request(app)
  //   .delete('/boards/19')
  //   .set('Authorization', `Bearer ${token}`);
  //   expect(response.status).toEqual(http.StatusCodes.UNAUTHORIZED);
  //   console.log(response.body.message);
  //   done();
  // });

   test('리스트 delete 실패(남의 리스트)', async (done) => {
    const data = {
      board_id: "1"
    };
    const response = await request(app)
    .delete('/boards/lists/23').send(data)
    .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(http.StatusCodes.UNAUTHORIZED);
    console.log(response.body.message);
    done();
  });

  test('리스트 delete 실패(부정확한 보드 아이디)', async (done) => {
    const data = {
      board_id: "55"
    };
    const response = await request(app)
    .delete('/boards/lists/36').send(data)
    .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(http.StatusCodes.UNAUTHORIZED);
    console.log(response.body.message);
    done();
  });

  test('카드 delete 실패(남의 카드)', async (done) => {
    const data = {
      board_id: "1"
    };
    const response = await request(app)
    .delete('/boards/lists/cards/1').send(data)
    .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(http.StatusCodes.UNAUTHORIZED);
    console.log(response.body.message);
    done();
  });

  test('카드 delete 실패(부정확한 보드 아이디)', async (done) => {
    const data = {
      board_id: "56"
    };
    const response = await request(app)
    .delete('/boards/lists/cards/108').send(data)
    .set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(http.StatusCodes.UNAUTHORIZED);
    console.log(response.body.message);
    done();
  });


// });
