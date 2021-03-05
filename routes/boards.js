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
  let userId = req.user.id;
  let boards = await boardService.getBoardList(userId);
  res.status(http.StatusCodes.OK).json({ boards, message: '보드 목록 가져오기 성공.' });
});

/*  2.board 주기 */
router.get('/:boardId', async (req, res) => {
  let userId = req.user.id;
  let boardId = req.params.boardId;
  let board = await boardService.getBoard(userId, boardId);
  if(board) {
    /* 스트림 토큰 발급 */
    let streamToken = jwtUtility.generateStreamToken(boardId);
    /* 늘 토큰을 새로 발급받도록 캐시 없애기 */
    res.set('Cache-Control', 'no-store');
    res.status(http.StatusCodes.OK).json({ streamToken, board, message: '보드와 스트림 토큰 전송.' });
  } else {
    /* 로그인 회원이지만 권한이 없는 보드 */
    res.status(http.StatusCodes.UNAUTHORIZED).json({ message: '보드에 권한이 없습니다.'});
  }
});
   
/* POST */
/*  1.보드 등록 */
router.post('/', async (req, res) => {
  let userId = req.user.id;
  let boardInput = {
    title: req.body.title || ''
  };
  let isCompleted = await boardService.createBoard(userId, boardInput);
  //보드 등록 완료
  if(isCompleted) {
    res.status(http.StatusCodes.CREATED).json({ message: '보드가 생성되었습니다.' });
  //보드 등록 실패
  } else {
    res.status(http.StatusCodes.BAD_REQUEST).json({ message: '보드 생성 실패' });
  }
});

/*  2.리스트 등록 */
router.post('/lists', async (req, res) => {
  let userId = req.user.id;
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
  let userId = req.user.id;
  let cardInput = {
    boardId: req.body.board_id,
    listId: req.body.list_id,
    content: req.body.content || '',
    index: req.body.index
  }
  let isCompleted = await boardService.createCard(userId, cardInput);
  if(isCompleted) {
    res.status(http.StatusCodes.CREATED).json({ message: '카드가 생성되었습니다.' });
  } else {
    res.status(http.StatusCodes.BAD_REQUEST).json({ message: '카드 생성 실패' });
  }
});

/* PUT */
/*  1.보드 수정 */
router.put('/:boardId', async (req, res) => {
  let userId = req.user.id;
  let boardInput = {
    id: req.params.boardId,
    title: req.body.title || ''
  };
  let isCompleted = await boardService.updateBoard(userId, boardInput);
  //보드 수정 완료
  if(isCompleted) {
    res.status(http.StatusCodes.OK).json({ message: '보드가 수정되었습니다.' });
  //보드 수정 실패
  } else {
    res.status(http.StatusCodes.UNAUTHORIZED).json({ message: '보드 수정 실패' });
  }
});
/*  2.리스트 수정 */
router.put('/lists/:listId', async (req, res) => {
  let userId = req.user.id;
  let listInput = {
    id: req.params.listId,
    title: req.body.title || '',
    boardId: req.body.board_id
  };
  let isCompleted = await boardService.updateList(userId, listInput);
  //리스트 수정 완료
  if(isCompleted) {
    res.status(http.StatusCodes.OK).json({ message: '리스트가 수정되었습니다.' });
  //리스트 수정 실패
  } else {
    res.status(http.StatusCodes.UNAUTHORIZED).json({ message: '리스트 수정 실패' });
  }
});
/*  3.카드 수정 */
router.put('/lists/cards/:cardId', async (req, res) => {
  let userId = req.user.id;
  let cardInput = {
    id: req.params.cardId,
    content: req.body.content || '',
    boardId: req.body.board_id
  };
  let isCompleted = await boardService.updateCard(userId, cardInput);
  //카드 수정 완료
  if(isCompleted) {
    res.status(http.StatusCodes.OK).json({ message: '카드가 수정되었습니다.' });
  //카드 수정 실패
  } else {
    res.status(http.StatusCodes.UNAUTHORIZED).json({ message: '카드 수정 실패' });
  }
});
/* DELETE */
/*  1.보드 삭제 */
router.delete('/:boardId', async (req, res) => {
  let userId = req.user.id;
  let boardId = req.params.boardId;
  let isCompleted = await boardService.removeBoard(userId, boardId);
  //보드 삭제 완료
  if(isCompleted) {
    res.status(http.StatusCodes.OK).json({ message: '보드가 삭제되었습니다.' });
  //보드 삭제 실패
  } else {
    res.status(http.StatusCodes.UNAUTHORIZED).json({ message: '보드 삭제 실패' });
  }
});
/*  2.리스트 삭제 */
router.delete('/lists/:listId', async (req, res) => {
  let userId = req.user.id;
  let boardId = req.body.board_id;
  let listId = req.params.listId;
  let isCompleted = await boardService.removeList(userId, boardId, listId);
  //보드 삭제 완료
  if(isCompleted) {
    res.status(http.StatusCodes.OK).json({ message: '리스트가 삭제되었습니다.' });
  //보드 삭제 실패
  } else {
    res.status(http.StatusCodes.UNAUTHORIZED).json({ message: '리스트 삭제 실패' });
  }
});
/*  3.카드 삭제 */
router.delete('/lists/cards/:cardId', async (req, res) => {
  let userId = req.user.id;
  let boardId = req.body.board_id;
  let cardId = req.params.cardId;
  let isCompleted = await boardService.removeCard(userId, boardId, cardId);
  //보드 삭제 완료
  if(isCompleted) {
    res.status(http.StatusCodes.OK).json({ message: '카드가 삭제되었습니다.' });
  //보드 삭제 실패
  } else {
    res.status(http.StatusCodes.UNAUTHORIZED).json({ message: '카드 삭제 실패' });
  }
});

module.exports = router;
