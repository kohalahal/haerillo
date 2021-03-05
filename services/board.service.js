const User = require("../models").users;
const Board = require("../models").boards;
const List = require("../models").lists;
const Card = require("../models").cards;

const streamRouter = require("../routes/stream");



/* TODO :

    db crud 실패하면! 오류만들기.

    Create
    1.보드 등록
    2.리스트 등록
    3.카드 등록

    Read
    1.boards 주기
    2.board 주기
      
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

    Utility
    1.유저가 보드 소유자인지 확인
    2.보드를 세부 정보 포함해서 찾기
    3.변경 사항을 온라인 클라이언트에게 전송

  */




/*  Create */
/*  1.보드 생성 */
async function createBoard(userId, boardInput) {
    /* 보드를 만들고, 쟉성자 유저와 연관관계 설정 */
    let board = await Board.create(boardInput);
    let user = await User.findByPk(userId);
    await user.addBoard(board);
    return true; 
}
/*  2.리스트 생성 */
async function createList(userId, listInput) {
    /* 보드 소유자인지 확인 */
    if(await userHasBoard(userId, listInput.boardId)) {
        await List.create(listInput);
        /* 클라이언트 갱신 */
        await sendEventsToClients(listInput.boardId);
        return true;
    }
    return false;
}
/*  3.카드 생성 */
async function createCard(userId, cardInput) {
    /* 보드 소유자인지 확인 */
    if(await userHasBoard(userId, cardInput.boardId)) {
        await Card.create(cardInput);
        console.log('new card');
        /* 클라이언트 갱신 */
        await sendEventsToClients(cardInput.boardId);
        return true;
    }
    return false;    
}

/*  Read */
/*  1.boards 주기 */
async function getBoardList(userId) {
    let user, boards;
    user =  await User.findByPk(userId);
    boards = await user.getBoards();
    return boards;
}
/*  2.board 주기 */
async function getBoard(userId, boardId) {
    let board = userHasBoard(userId, boardId);
    if(board) return board;
    return null;
}


   
/*  Update */
/*  1.보드 수정 */
/*  2.리스트 수정 */
/*  3.카드 수정 */

/*  Delete */
/*  1.보드 삭제 */
/*  2.리스트 삭제 */
/*  3.카드 삭제 */


/* Utility */
/* 1.유저가 보드 소유자인지 확인 */
async function userHasBoard(userId, boardId) {
    let user = await User.findByPk(userId);
    let board = await getFullBoard(boardId);
    if(await user.hasBoard(board)) return board;
    return null;
}
/* 2.보드를 세부 정보 포함해서 찾기 */
async function getFullBoard(boardId) {
    return await Board.findOne({
        where: {
            id: boardId
        },
        include: [{
            model: List,
            required: false,            
            include: [{
                model: Card,
                required: false                
            }]
        }]
    });
}
/* 3.변경 사항을 온라인 클라이언트에게 전송 */
async function sendEventsToClients(boardId) {
    let board = await getFullBoard(boardId);
    streamRouter.sendEvents(boardId, board);
}

exports.createBoard = createBoard;
exports.createList = createList;
exports.createCard = createCard;
exports.getBoardList = getBoardList;
exports.getBoard = getBoard;