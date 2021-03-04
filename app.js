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

app.use('/static', express.static('public'));
app.use('/', express.static(__dirname + '/public'));
app.get('/board', function(req, res, next) {
    res.sendFile(path.join(__dirname, "./public", "board.html"));
});
// app.get('/board/:id', function(req, res, next) {
//     res.sendFile(path.join(__dirname, "./public", "board.html"));
// });
app.get('/login', function(req, res, next) {
    res.sendFile(path.join(__dirname, "./public", "login.html"));
});
app.get('/join', function(req, res, next) {
    res.sendFile(path.join(__dirname, "./public", "join.html"));
});

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
