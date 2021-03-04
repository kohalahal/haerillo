const express = require('express');
const router = express.Router();
const http = require('http-status-codes');
const jwt = require("jsonwebtoken");
const authConfig = require('../config/auth.config');
const boardService = require('../services/board.service');


/* TODO :
  GET
    1.보드 목록 주기
    2.보드 내부 요소 정보 주기
    3.변경 사항 보내기
      
  POST
    1.보드 등록
    2.리스트 등록
    3.카드 등록

  PUT
    1.보드 수정
    2.리스트 수정
    3.카드 수정

  DELETE
    1.보드 삭제
    2.리스트 삭제
    3.카드 삭제

    UTILITY
    0.토큰에서 유저 정보 가져오기

  */


 /* GET */
/*  1.보드 목록 주기 */
router.get('/', async (req, res) => {
  console.log('겟보드 라우터');
  let userId = getUserIdFromToken(req);
  let boards = await boardService.getBoardList(userId);
  res.status(http.StatusCodes.OK).json(boards);
});
/*  2.보드 내부 요소 정보 주기 */
router.get('/:boardId', async (req, res) => {
  let userId = getUserIdFromToken(req);
  let boardId = req.params.boardId;
  if(!userId || !boardId) {
    res.status(http.StatusCodes.UNAUTHORIZED).json('보드에 권한이 없습니다.');
  }
  let board = await boardService.getBoard(userId, boardId);
  console.log('받은 보드:'+board);
  if(board) {
    console.log('ㅇㅋ');
    res.status(http.StatusCodes.OK).json(board);
  } else {
    console.log('ㄴㄴ');
    res.status(http.StatusCodes.UNAUTHORIZED).json('보드에 권한이 없습니다.');
  }
});
/*  3.변경 사항 보내기 */
   
/* POST */
/*  1.보드 등록 */
router.post('/', async (req, res) => {
  // 보드 입력
  let boardInput = {
    title: req.body.title || ''
  };
  // 작성자
  let userId = getUserIdFromToken(req);
  // 작성자 유효성 체크
  if(userId) {
    let isCompleted = await boardService.createBoard(boardInput, userId);
    //보드 등록 완료
    if(isCompleted) {
      res.status(http.StatusCodes.CREATED).json({ message: '보드가 생성되었습니다.' });
    //보드 등록 실패
    } else {
      res.status(http.StatusCodes.BAD_REQUEST).json({ message: '보드 생성 실패' });
    }
  } else {
    //작성자 유효성 체크 실패
    res.status(http.StatusCodes.UNAUTHORIZED);
  }
});
/*  2.리스트 등록 */
router.post('/lists', async (req, res) => {
  let listInput = {
    boardId: req.body.board_id,
    title: req.body.title || '',
    index: req.body.index
  }
  let isCompleted = boardService.createList(listInput);
  if(isCompleted) {
    res.status(http.StatusCodes.CREATED).json({ message: '리스트가 생성되었습니다.' });
  } else {
    res.status(http.StatusCodes.BAD_REQUEST).json({ message: '리스트 생성 실패' });
  }
});
/*  3.카드 등록 */
router.post('/lists/cards', async (req, res) => {
  let cardInput = {
    listId: req.body.list_id,
    content: req.body.content || '',
    index: req.body.index
  }
  console.log('보드라우터');
  console.log(req.body.list_id);
  console.log(req.body.content);
  console.log(req.body.index);
  let isCompleted = boardService.createCard(cardInput);
  if(isCompleted) {
    res.status(http.StatusCodes.CREATED).json({ message: '카드가 생성되었습니다.' });
  } else {
    res.status(http.StatusCodes.BAD_REQUEST).json({ message: '카드 생성 실패' });
  }
});


/* PUT */
/*  1.보드 수정 */
/*  2.리스트 수정 */
/*  3.카드 수정 */

/* DELETE */
/*  1.보드 삭제 */
/*  2.리스트 삭제 */
/*  3.카드 삭제 */

/* UTILITY */
/* 0.토큰에서 유저 정보 가져오기 */
function getUserIdFromToken(req) {
  if (req.headers && req.headers.authorization) {
      let authorization = req.headers.authorization.split(' ')[1],
          decoded;
      try {
          decoded = jwt.verify(authorization, authConfig.secret);
          return decoded.id;
      } catch (error) {
          console.log(error);
      }
  }
  return null;
}


module.exports = router;

/* 테스트용 */
module.exports.getUserIdFromToken = getUserIdFromToken;
