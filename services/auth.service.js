const User = require("../models").users;
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config');
const http = require('http-status-codes');


/* TODO
    1.유저네임 중복 체크
    2.이메일 중복 체크
    3.가입
    4.로그인
*/

/* 1.유저네임 중복 체크 */
async function checkUsername(username) {
    let username_user;
    try {
        username_user = await User.findOne({ where: { username } });
        if(username_user) {
            console.log('중복 유저네임');
            return false;
        };
        return true;
    } catch(error) {
        console.log(error);
        return false;
    }
}


/* 2.이메일 중복 체크 */
async function checkEmail(email) {
    let email_user;
    try {
        email_user = await User.findOne({ where: { email } });
        if(email_user) {
            console.log('중복 이메일');
            return false;
        };
        return true;
    } catch(error) {
        console.log(error);
        return false;
    }
}


/* 3.회원 가입 */
async function register(req, res, next) {
    const { username, email, password } = req.body;
    /* 입력이 없으면 오류 */
    if(!username || !email || !password) {
        console.log('불충분한 입력');
        res.status(http.StatusCodes.BAD_REQUEST).json({ message: '불충분한 입력' });
        return;
    }
    /* 유저네임, 이메일 중복 검사 */
    let usernamePassed = await checkUsername(username);
    if(!usernamePassed) {
        console.log('중복 유저네임');
        res.status(http.StatusCodes.BAD_REQUEST).json({ message: '중복된 유저네임입니다.' });
        return;
    } 
    let emailPassed = await checkEmail(email);
    if(!emailPassed) {
        console.log('중복 이메일');
        res.status(http.StatusCodes.BAD_REQUEST).json({ message: '중복된 이메일입니다.' });
        return;
    }
    console.log('어스서비스회원가입');
    /* 통과시 회원가입 */
    //비밀번호 암호화
    const passwordHash = bcrypt.hashSync(password, 10);
    //유저 생성
    User.create({
        username: username,
        email: email,
        password: passwordHash
    }).then(function(user){
        // 가입 성공
        console.log('가입성공');
        res.status(http.StatusCodes.CREATED).json({ message: '회원 가입' });
    });
	// 실패
    console.log('가입실패');
    res.status(http.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: '회원가입 실패.' }); 
}



/* 4.로그인 */
async function authorize(req, res, next) {
    console.log(',로그인');
    passport.authenticate('verify', { session: false }, (err, user, message) => {
        if (!user) {
          res.status(http.StatusCodes.UNAUTHORIZED).json({ message: message });
        } else {
            const token = jwt.sign({
                id: user.id, 
                username : user.username
            }, // 토큰에 입력할 private 값
            authConfig.secret, // 나만의 시크릿키
            { expiresIn: "15m" } // 토큰 만료 시간
            );
            res.status(http.StatusCodes.OK).json({ token, message: message });
        }
      })(req, res, next);
}


exports.register = register;
exports.authorize = authorize;