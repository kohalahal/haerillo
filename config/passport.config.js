const passport = require('passport');
const bcrypt = require('bcrypt');
const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;

const User = require('../models').users;
const authConfig = require('../config/auth.config');

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

/* AUTHENTICATE : 로그인 인증 방식 */
passport.use(
  'verify',
  new LocalStrategy(LocalStrategyOption, async (username, password, done) => {
    let user;
    console.log('로그인1'+'username:'+username+'password'+password);
    try {
      console.log('로그인2');
      user = await User.findOne({ where: { username } });
      if (!user) {
        console.log('회원없음');
        return done(null, false, { message: '잘못된 유저네임입니다.' });
      }
      console.log('로그인3'+'username:'+user.username+" password:"+user.password);
      const isSamePassword = await bcrypt.compare(password, user.password);
      if (!isSamePassword) {
        console.log('비번틀림');
        return done(null, false, { message: '잘못된 패스워드입니다.' });
      }
      console.log('로그인4');
    } catch (error) {
      console.log('로그인에러'+error);
      done(error);
    }
    console.log('로그인5');

    /* 로그인 성공 */
    return done(null, user, { message: '로그인 성공' });
  }
));


/* 2.JWT 로컬 스트레터지 설정 */
/* 토큰 형식 */
const jwtStrategyOption = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  // jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: authConfig.secret,

    /* JWT 옵션 */
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
      // jwtPayload에 유저 정보가 담겨있다.
      // 해당 정보로 유저 식별 로직을 거친다.
      user = await User.findOne({ where: payload.id });  
      // 유효한 유저라면
      if (user) {
        done(null, user);
        return;
      }
      // 유저가 유효하지 않다면
      done(null, false, { message: 'inaccurate token.' });
    } catch (error) {
      console.error(error);
      done(error);
    }    
  }
));


module.exports = { passport };