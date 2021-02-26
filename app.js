const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql2/promise');
const sequelize = require('./models/index');

const indexRouter = require('./routes/index');
const boardRouter = require('./routes/board');
const registerRouter = require('./routes/register');

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
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/board', boardRouter);
app.use('/register', registerRouter);

module.exports = app;
