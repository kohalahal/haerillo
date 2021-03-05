const express = require('express');
const router = express.Router();
const http = require('http-status-codes');
const jwtUtility = require('../utility/jwt.utility');
const boardService = require('../services/board.service');

/* 목차

  GET
    1.boards 주기
    2.board 주기
      
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
    
*/

/* GET */
/*  1.boards 주기 */
router.get('/', async (req, res) => {
  let userId = jwtUtility.getUserIdFromToken(req);
  let boards = await boardService.getBoardList(userId);
  res.status(http.StatusCodes.OK).json(boards);
});

/*  2.board 주기 */
router.get('/:boardId', async (req, res) => {
  let userId = jwtUtility.getUserIdFromToken(req);
  let boardId = req.params.boardId;
  let board = await boardService.getBoard(userId, boardId);
  if(board) {
    /* 스트림 토큰 발급 */
    let streamToken = jwtUtility.generateStreamToken(boardId);
    /* 늘 토큰을 새로 발급받도록 캐시 없애기 */
    res.set('Cache-Control', 'no-store');
    res.status(http.StatusCodes.OK).json({ streamToken, board });
  } else {
    /* 로그인 회원이지만 권한이 없는 보드 */
    console.log('로그인 회원이 남의 보드 요청');
    res.status(http.StatusCodes.UNAUTHORIZED).json({ message: '보드에 권한이 없습니다.'});
  }
});
   
/* POST */
/*  1.보드 등록 */
router.post('/', async (req, res) => {
  let userId = jwtUtility.getUserIdFromToken(req);
  let boardInput = {
    title: req.body.title || ''
  };
  // 작성자 유효성 체크
  if(userId) {
    let isCompleted = await boardService.createBoard(userId, boardInput);
    //보드 등록 완료
    if(isCompleted) {
      res.status(http.StatusCodes.CREATED).json({ message: '보드가 생성되었습니다.' });
    //보드 등록 실패
    } else {
      res.status(http.StatusCodes.BAD_REQUEST).json({ message: '보드 생성 실패:보드 생성 관련' });
    }
  } else {
    //작성자 유효성 체크 실패
    res.status(http.StatusCodes.UNAUTHORIZED).json({ message: '보드 생성 실패:유저 관련' });;
  }
});

/*  2.리스트 등록 */
router.post('/lists', async (req, res) => {
  let userId = jwtUtility.getUserIdFromToken(req);
  let listInput = {
    boardId: req.body.board_id,
    title: req.body.title || '',
    index: req.body.index
  }
  let isCompleted = await boardService.createList(userId, listInput);
  if(isCompleted) {
    res.status(http.StatusCodes.CREATED).json({ message: '리스트가 생성되었습니다.' });
  } else {
    res.status(http.StatusCodes.BAD_REQUEST).json({ message: '리스트 생성 실패' });
  }
});

/*  3.카드 등록 */
router.post('/lists/cards', async (req, res) => {
  let userId = jwtUtility.getUserIdFromToken(req);
  let cardInput = {
    boardId: req.body.board_id,
    listId: req.body.list_id,
    content: req.body.content || '',
    index: req.body.index
  }
  console.log('보드라우터');
  console.log(req.body.list_id);
  console.log(req.body.content);
  console.log(req.body.index);
  let isCompleted = await boardService.createCard(userId, cardInput);
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


module.exports = router;
