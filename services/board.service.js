const User = require("../models").users;
const Board = require("../models").boards;
const List = require("../models").lists;
const Card = require("../models").cards;

const streamRouter = require("../routes/stream");



/* 목차

    Create
    1.보드 등록
    2.리스트 등록
    3.카드 등록

    Read
    1.boards 주기
    2.board 주기
      
    -TODO-
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

    *오류 핸들

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
    /* 유저가 소유한 보드인지 확인 */
    let board = await userHasBoard(userId, boardId);
    if(board) return board;
    return null;
}

/*  Update */
/*  1.보드 수정 */
async function updateBoard(userId, boardInput) {
    /* 유저가 소유한 보드인지 확인 */
    if(await userHasBoard(userId, boardInput.id)) {
        await Board.update({
            title: boardInput.title
        }, {
            where: { id: boardInput.id } 
        });
        return true;
    }
    return false;
}
/*  2.리스트 수정 */
async function updateList(userId, listInput) {
    /* 유저가 소유한 보드인지 확인 */
    if(await userHasBoard(userId, listInput.boardId)) {
        await List.update({
            title: listInput.title
        }, {
            where: { id: listInput.id } 
        });
        return true;
    }
    return false;
}
/*  3.카드 수정 */
async function updateCard(userId, cardInput) {
    /* 유저가 소유한 보드인지 확인 */
    if(await userHasBoard(userId, cardInput.boardId)) {
        await Card.update({
            content: cardInput.content
        }, {
            where: { id: cardInput.id } 
        });
        return true;
    }
    return false;
}

/*  Delete */
/*  1.보드 삭제 */
async function removeBoard(userId, boardId) {
    /* 유저가 소유한 보드인지 확인 */
    if(await userHasBoard(userId, boardId)) {
        await Board.destroy({
            where: { id: boardId } 
        });
        return true;
    }
    return false;
}
/*  2.리스트 삭제 */
async function removeList(userId, boardId, listId) {
    /* 유저가 소유한 보드인지 확인 */
    if(await userHasBoard(userId, boardId)) {
        /* 보드아이디가 정확한지 확인 */
        const boardIdFromDB = await List.findByPk(listId).boardId;
        if(boardId == boardIdFromDB) {
            await List.destroy({
                where: { id: listId } 
            });
            return true;
        }
    }
    return false;
}
/*  3.카드 삭제 */
async function removeCard(userId, boardId, cardId) {
    /* 유저가 소유한 보드인지 확인 */
    if(await userHasBoard(userId, boardId)) {
        /* 보드아이디가 정확한지 확인 */
        const boardIdFromDB = await Card.findByPk(cardId).boardId;
        if(boardId == boardIdFromDB) {
            await Card.destroy({
                where: { id: cardId } 
            });
            return true;
        }
    }
    return false;
}

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
exports.updateBoard = updateBoard;
exports.updateList = updateList;
exports.updateCard = updateCard;
exports.removeBoard = removeBoard;
exports.removeList = removeList;
exports.removeCard = removeCard;