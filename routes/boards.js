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
  const boards = await boardService.getBoardList(req.user.id);
  res.status(http.StatusCodes.OK).json({ boards, message: '보드 목록 가져오기 성공.' });
});

/*  2.board 주기 */
router.get('/:boardId', async (req, res) => {
  const board = await boardService.getBoard(req.user.id, req.params.boardId);
  if(board) {
    /* 스트림 토큰 발급 */
    const streamToken = jwtUtility.generateStreamToken(req.params.boardId);
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
  const boardInput = {
    title: req.body.title || '새로운 보드'
  };
  const isCompleted = await boardService.createBoard(req.user.id, boardInput);
  //보드 등록 완료
  if(isCompleted) {
    res.status(http.StatusCodes.CREATED).json({ message: '보드가 생성되었습니다.', boardId: isCompleted.id });
  //보드 등록 실패
  } else {
    res.status(http.StatusCodes.BAD_REQUEST).json({ message: '보드 생성 실패' });
  }
});

/*  2.리스트 등록 */
router.post('/lists', async (req, res) => {
  const listInput = {
    boardId: req.body.board_id,
    title: req.body.title || '',
    index: req.body.index
  }
  const isCompleted = await boardService.createList(req.user.id, listInput);
  if(isCompleted) {
    res.status(http.StatusCodes.CREATED).json({ message: '리스트가 생성되었습니다.' });
  } else {
    res.status(http.StatusCodes.BAD_REQUEST).json({ message: '리스트 생성 실패' });
  }
});

/*  3.카드 등록 */
router.post('/lists/cards', async (req, res) => {
  const cardInput = {
    boardId: req.body.board_id,
    listId: req.body.list_id,
    content: req.body.content || '',
    index: req.body.index
  }
  const isCompleted = await boardService.createCard(req.user.id, cardInput);
  if(isCompleted) {
    res.status(http.StatusCodes.CREATED).json({ message: '카드가 생성되었습니다.' });
  } else {
    res.status(http.StatusCodes.BAD_REQUEST).json({ message: '카드 생성 실패' });
  }
});

/* PUT */
/*  1.보드 수정 */
router.put('/:boardId', async (req, res) => {
  const boardInput = {
    id: req.params.boardId,
    title: req.body.title || ''
  };
  const isCompleted = await boardService.updateBoard(req.user.id, boardInput);
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
  if(req.body.board_id==undefined) return res.status(http.StatusCodes.BAD_REQUEST).json({ message: '리스트 수정 실패' });
  const listInput = {};
  if(req.body.title!=undefined) listInput.title = req.body.title;
  if(req.body.index!=undefined) listInput.index = req.body.index;
  const isCompleted = await boardService.updateList(req.user.id,  req.body.board_id, req.params.listId, listInput);
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
  if(req.body.board_id==undefined) return res.status(http.StatusCodes.BAD_REQUEST).json({ message: '카드 수정 실패' });
  const cardInput = {};
  if(req.body.list_id!=undefined) cardInput.listId = req.body.list_id;
  if(req.body.content!=undefined) cardInput.content = req.body.content;
  if(req.body.index!=undefined) cardInput.index = req.body.index;
  const isCompleted = await boardService.updateCard(req.user.id, req.body.board_id, req.params.cardId, cardInput);
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
  const isCompleted = await boardService.removeBoard(req.user.id, req.params.boardId);
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
  if(req.body.board_id==undefined) return res.status(http.StatusCodes.BAD_REQUEST).json({ message: '카드 수정 실패' });
  const isCompleted = await boardService.removeList(req.user.id, req.body.board_id, req.params.listId);
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
  if(req.body.board_id==undefined || req.body.list_id==undefined) return res.status(http.StatusCodes.BAD_REQUEST).json({ message: '카드 삭제 실패' });
  const isCompleted = await boardService.removeCard(req.user.id, req.body.board_id, req.body.list_id, req.params.cardId);
  //보드 삭제 완료
  if(isCompleted) {
    res.status(http.StatusCodes.OK).json({ message: '카드가 삭제되었습니다.' });
  //보드 삭제 실패
  } else {
    res.status(http.StatusCodes.UNAUTHORIZED).json({ message: '카드 삭제 실패' });
  }
});

module.exports = router;
