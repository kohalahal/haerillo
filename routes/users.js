const express = require('express');
const router = express.Router();
const models = require('../models');
const path = require('path');

// router.get('/', function(req, res, next) {
//   res.sendFile();
// });

/* POST 로 새로운 회원 가입 정보 보낼때 */
router.post('/', function(req, res, next) {
  console.log('가입post');
  let body = req.body;

  console.log('username:'+body.username+' email:'+body.email);

  models.users.create({
    username: body.username,
    email: body.email,
    password: body.password1
  })
  .then( result => {
    console.log('가입');
    // res.redirect("/login");
  })
  .catch( err => {
    console.log(err);
  });

  //유저네임 중복체크, 이메일 중복체크, 패스워드 입력 확인
  if(models.users.isNewUsername(body.username)) {
    console.log('가입자 유저네임 체크 통과');
    if(models.users.isNewEmail(body.email)) {
      console.log('가입자 이메일 체크 통과');
      if(checkPassword(body.password1, body.password2)) {
      console.log('가입자 비밀번호 체크 통과');
      } else { console.log('중복체크3 실패'); }
    } else { console.log('중복체크2 실패'); }
  } else { console.log('중복체크1 실패'); }



});

function checkPassword(password1, password2) {
  return password1==password2;
}

module.exports = router;
