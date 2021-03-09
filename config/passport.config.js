const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwtConfig = require('../config/jwt.config');
const User = require('../models').users;
const bcrypt = require('bcrypt');
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;


/* 목차
  1.로컬 스트레터지(인증 방식)
  2.JWT 스트레터지(JWT토큰)
*/

/* 1.로컬 스트레터지 설정 */
/* 사용 변수 */
const LocalStrategyOption = {
  usernameField: 'username',
  passwordField: 'password',
};

/* AUTHENTICATE : 인증 방식 */
passport.use(
  'login',
  new LocalStrategy(LocalStrategyOption, async (username, password, done) => {
    let user;
    try {
      /* 유저네임 확인 */
      user = await User.findOne({ where: { username } });
      if (!user) {        
        return done(null, { message: '존재하지 않는 유저네임입니다.' });
      }
      /* 패스워드 일치 확인 */
      const isSamePassword = await bcrypt.compare(password, user.password);
      if (!isSamePassword) {
        return done(null, { message: '패스워드가 일치하지 않습니다.' });
      }
    } catch (err) {
      return done(null);
    }
    /* 로그인 성공 */
    return done(user);
  }
));


/* 2.JWT 로컬 스트레터지 설정 */
/* 토큰 형식 */
const jwtStrategyOption = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtConfig.secret,
  // passReqToCallback: true
    /* 다른 JWT 옵션 */
  // issuer: 'enter issuer here',
  // audience: 'enter audience here',
  // algorithms: ['RS256'],
  // ignoreExpiration: false,
  // passReqToCallback: false,
  // jsonWebTokenOptions: {
  //     complete: false,
  //     clockTolerance: '',
  //     maxAge: '2d', // 2 days
  //     clockTimestamp: '100',
  //     nonce: 'string here for OpenID'
  // }
};

/* AUTHORIZE : 토큰 부여 방식 */
passport.use(
  'jwt',
  new JWTStrategy(jwtStrategyOption, async (payload, done) => {
    let user;
    try {
      user = await User.findOne({ where: payload.id });  
      /* 유효한 유저 */
      if (user) {
        done(null, user);
        return;
      }
      /* 로그인 실패 */
      done(null, false);
    } catch (err) {
      /* 에러 */
      done(err, false);
    }    
  }
));


module.exports = { passport };