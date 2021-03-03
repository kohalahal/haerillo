const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');

/* TODO :
  GET
    1.유저네임 체크
    2.이메일 중복체크
  
  POST
    1.회원가입
    2.로그인
    3.토큰리프레쉬

  */

/* GET */
/* 1.유저네임 중복체크 */
router.get('/username/:username', async (req, res) => {
  res.status(http.StatusCodes.OK).json({ result: authService.checkUsername(req.params.username) });
});

/* 2.이메일 중복체크 */
router.get('/email/:email', async (req, res) => {
  res.status(http.StatusCodes.OK).json({ result: authService.checkEmail(req.params.email) });
});

/* POST */
/* 1.회원가입 */
router.post('/join', authService.register);

/* 2.로그인 */
router.post('/login', authService.authorize);


/* 3.토큰리프레쉬 */

 
module.exports = router;
