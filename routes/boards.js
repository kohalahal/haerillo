var express = require('express');
var router = express.Router();
const path = require('path');


/* TODO :
  GET
    1.회원 검증 후 보드, 리스트, 카드 정보 주기
    2.변경 사항 보내기
      
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

/* GET board page. */
router.get('/board', function(req, res, next) {
  res.sendFile(path.join(__dirname, "../public", "board.html"));
});

module.exports = router;
