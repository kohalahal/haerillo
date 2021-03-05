const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql2/promise');

const sequelize = require('./models/index');
// const passport = require('passport');
const { passport } = require('./config/passport.config');

const authRouter = require('./routes/auth');
const boardRouter = require('./routes/boards');
const streamRouter = require('./routes/stream');

const app = express();

// sequelize.sequelize.sync({force: true, logging: false}).then(() => {
//       console.log('db 초기화 완료');
//     }).catch((err) => {
//         console.error('db 초기화 실패');
//         console.error(err);
//     }).finally(() => sequelize.sequelize.close());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

//static 프론트 파일
app.use('/static', express.static('public'));
app.use('/', express.static(__dirname + '/public'));
app.get('/board', function(req, res, next) {
    res.sendFile(path.join(__dirname, "./public", "board.html"));
});
app.get('/login', function(req, res, next) {
    res.sendFile(path.join(__dirname, "./public", "login.html"));
});
app.get('/join', function(req, res, next) {
    res.sendFile(path.join(__dirname, "./public", "join.html"));
});

//auth, stream, boards api 라우터
app.use('/auth', authRouter);
app.use('/stream', streamRouter);
//보드 정보에는 로그인 회원만 접근 가능
app.use('/boards', passport.authenticate('jwt', {session: false}), boardRouter);

module.exports = app;
