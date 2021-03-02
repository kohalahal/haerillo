const express = require('express');
const router = express.Router();
const path = require('path');
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

  */


 /* GET */
/*  1.보드 목록 주기 */
/*  2.보드 내부 요소 정보 주기 */
/*  3.변경 사항 보내기 */
   
/* POST */
/*  1.보드 등록 */
router.post('/', boardService.createBoard);
/*  2.리스트 등록 */
router.post('/lists', boardService.createList);
/*  3.카드 등록 */
router.post('/lists/cards', boardService.createCard);

/* PUT */
/*  1.보드 수정 */
/*  2.리스트 수정 */
/*  3.카드 수정 */

/* DELETE */
/*  1.보드 삭제 */
/*  2.리스트 삭제 */
/*  3.카드 삭제 */


module.exports = router;
