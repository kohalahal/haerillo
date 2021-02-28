const express = require('express');
const router = express.Router();
const models = require('../models');
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = models.users;

/* TODO :
  GET
    1.이메일 체크
    2.유저네임 중복체크
  
  POST
    1.회원가입
    2.로그인
    3.로그아웃
    4.토큰리프레쉬

  */

/* GET */
/* 1.이메일체크 */
/* 2.유저네임체크 */


/* POST */
/* 1.회원가입 */

router.post('/', async (req, res, next) => {
  // req.body에서 username, email, password 가져옴
  const { username, email, password } = req.body;
  try {
    // 이미 username 있는 경우를 방지
    const exUser1 = await User.findOne({ where: { username } });
    if (exUser1) {
      res.status(500).json({ message: '중복되는 유저네임.' });
      return;
    }
    // 이미 email이 있는 경우를 방지
    const exUser2 = await User.findOne({ where: { email } });
    if (exUser2) {
      res.status(500).json({ message: '중복되는 이메일.' });
      return;
    }
	// bcrypt로 password를 암호화해줍니다.
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      username,
      email,
      password: hash,
    });
    return res.status(200).json({message: 'success'});
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

/* 2.로그인 */
router.post('/login', async (req, res, next) => {
  console.log('@@@로그인');
  try {
    passport.authenticate('local', (passportError, user, info) => {
			// 인증이 실패했거나 유저 데이터가 없다면 에러 발생
      if (passportError || !user) {
        res.status(400).json({ message: info.reason });
        return;
      }
			// user데이터를 통해 로그인 진행
      req.login(user, { session: false }, (loginError) => {
        if (loginError) {
          res.send(loginError);
          return;
        }
		// 클라이언트에게 JWT생성 후 반환
		const token = jwt.sign(
			{ username: user.username,  auth: user.auth },
			'jwt-secret-key'
		);
       res.json({ token });
       return;
      });
    })(req, res);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
/* 3.로그아웃 */
/* 4.토큰리프레쉬 */



 
module.exports = router;
