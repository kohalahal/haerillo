const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql2/promise');
const sequelize = require('./models/index');
// const passport = require('passport');
const { passport } = require('./config/passport.config');

const pageRouter = require('./routes/pages');
const boardRouter = require('./routes/boards');
const authRouter = require('./routes/auth');

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

//홈페이지 핸들링 옵션
//1.홈페이지를 스태틱 페이지로
app.use('/', express.static(__dirname + '/public'));
//2.홈페이지를 페이지 라우터에서 핸들(/pages로 리다이렉트)
// app.get('/', function(req, res) {
//     res.redirect('/pages');
// });

//페이지 라우터
app.use('/pages', pageRouter);
//api 라우터
app.use('/auth', authRouter);
app.use('/boards', passport.authenticate('jwt', {session: false}), boardRouter);

// app.get('/stream', (req, res) => {
//     res.setHeader("Content-Type", "text/event-stream");
//     setInterval(function() {
//         console.log('interval');
//         res.write('data: '+'news\n\n');
//     }, 4000);
// });

module.exports = app;
