const User = require("../models").users;
const Board = require("../models").boards;
const List = require("../models").lists;
const Card = require("../models").cards;

const authConfig = require('../config/auth.config');
const jwt = require("jsonwebtoken");
const http = require('http-status-codes');

/* TODO :

    0. 토큰에서 유저 정보(숫자 id) 가져오기

    Create
    1.보드 등록
    2.리스트 등록
    3.카드 등록

    Read
    1.보드 목록 주기
    2.보드 정보 주기
    3.변경 사항 보내기
      
    Update
    1.보드 수정
    2.리스트 수정
    3.카드 수정
    4.보드 사용자 추가

    Delete
    1.보드 삭제
    2.리스트 삭제
    3.카드 삭제
    4.보드 사용자 삭제

  */

/* 0.토큰에서 유저 정보 가져오기 */
async function getUserId(req) {
    if (req.headers && req.headers.authorization) {
        let authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, authConfig.secret);
        } catch (error) {
            console.log('유저찾기 실패');
        }
        return decoded.id;
    }
    console.log('유저찾기 실패');
    return null;
}


/*  Create */
/*  1.보드 생성 */
async function createBoard(req, res, next) {   
    let userId = getUserId(req);
    let boardInput = {
            title: req.body.title ?? '',
        };
    /* 보드를 만들고, 글쓴이 유저와 연관관계 설정 */
    Board.create(boardInput).then((board) => {
            User.findOne({ where: userId }).then((user) => {
                user.addBoard(board);
            });
        });
    console.log('new board');
    res.status(http.StatusCodes.CREATED).json({ message: '보드 생성' });
}
/*  2.리스트 생성 */
async function createList(req, res, next) {
    let listInput = {
        boardId: req.body.board_id,
        title: req.body.title ?? '',
        index: req.body.index
    };
    await List.create(listInput).then(function(list) {
        console.log('new list');
        res.status(http.StatusCodes.CREATED).json({ message: '리스트 생성' });
    });
}
/*  3.카드 생성 */
async function createCard(req, res, next) {
    let cardInput = {
        listId: req.body.list_id,
        content: req.body.content ?? '',
        index: req.body.index
    };
    await Card.create(cardInput).then(function(card) {
        console.log('new card');
        res.status(http.StatusCodes.CREATED).json({ message: '카드 생성' });
    });
}

/*  Read */
/*  1.보드 목록 주기 */
/*  2.보드 정보 주기 */
/*  3.변경 사항 보내기 */
   
/*  Update */
/*  1.보드 수정 */
/*  2.리스트 수정 */
/*  3.카드 수정 */

/*  Delete */
/*  1.보드 삭제 */
/*  2.리스트 삭제 */
/*  3.카드 삭제 */




exports.createBoard = createBoard;
exports.createList = createList;
exports.createCard = createCard;