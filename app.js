const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql2/promise');
const sequelize = require('./models/index');

const boardRouter = require('./routes/boards');
const userRouter = require('./routes/users');

const app = express();
sequelize.sequelize.sync().then(() => {
      console.log('db 초기화 완료');
    }).catch((err) => {
        console.error('db 초기화 실패');
        console.error(err);
    });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', express.static(__dirname + '/public'));
app.use('/register', express.static(__dirname + '/public/register.html'));
app.use('/login', express.static(__dirname + '/public/login.html'));

// app.use('/', indexRouter);
// app.use('/board', boardRouter);
// app.use('/register', registerRouter);
// app.use('/login', loginRouter);

app.use('/users', userRouter);
app.use('/boards', boardRouter);

module.exports = app;
