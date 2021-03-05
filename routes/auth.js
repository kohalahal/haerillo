const express = require('express');
const router = express.Router();
const http = require('http-status-codes');
const passport = require('passport');
const jwtUtility = require('../utility/jwt.utility');
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
  res.status(http.StatusCodes.OK).json({ message: await authService.checkUsername(req.params.username) });
});

/* 2.이메일 중복체크 */
router.get('/email/:email', async (req, res) => {
  res.status(http.StatusCodes.OK).json({ message: await authService.checkEmail(req.params.email) });
});

/* POST */
/* 1.회원가입 */
router.post('/join', async (req, res) => {
  /* 유저 입력 */
  const userInput = { 
    username: req.body.username, 
    email: req.body.email, 
    password: req.body.password
  };
  /* 입력 체크 */
  if(!userInput.username || !userInput.email || !userInput.password) {
    res.status(http.StatusCodes.BAD_REQUEST).json({ message: '잘못된 입력입니다.' });
    return;
  }
  /* 중복 체크 */
  if(!await authService.checkUsername(userInput.username)) {
    res.status(http.StatusCodes.BAD_REQUEST).json({ message: '중복된 유저네임입니다.' });
    return;
  }
  if(!await authService.checkEmail(userInput.email)) {
    res.status(http.StatusCodes.BAD_REQUEST).json({ message: '중복된 이메일입니다.' });
    return;
  }
  /* 가입 성공 */
  if(await authService.register(userInput)) {
    res.status(http.StatusCodes.CREATED).json({ message: '회원이 되신 것을 축하드립니다.' });
  } else {
    /* 가입 실패 */
    res.status(http.StatusCodes.BAD_REQUEST).json({ message: '회원 가입에 실패하였습니다.' }); 
  }
});

/* 2.로그인 */
router.post('/login', async (req, res, next) => {
  passport.authenticate('login', { session: false }, (user, message) => {
    /* 로그인 성공시 user 리턴 */
    if (user) {      
      let token = jwtUtility.generateLoginToken(user.id, user.username);
      res.status(http.StatusCodes.OK).json({ token, message: '로그인 성공' });
    } else {
      /* 로그인 실패 - message에 로그인 실패 이유 */
      res.status(http.StatusCodes.UNAUTHORIZED).json(message);
    }
  })(req, res, next);
});


/* 3.토큰리프레쉬 */

 
module.exports = router;
