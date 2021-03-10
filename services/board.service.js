const models = require("../models");
const User = require("../models").users;
const Board = require("../models").boards;
const List = require("../models").lists;
const Card = require("../models").cards;
const { Op } = require("sequelize");

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
    try {
        let board = await Board.create(boardInput);
        let user = await User.findByPk(userId);
        await user.addBoard(board);
        return board; 
    } catch {
    }
    return null;
}
/*  2.리스트 생성 */
async function createList(userId, listInput) {
    /* 보드 소유자인지 확인 */
    if(await userHasBoard(userId, listInput.boardId)) {
        try {
            const list = await List.create(listInput);
            /* 클라이언트 갱신 */
            listInput.model = "LIST";
            listInput.type = "CREATE";
            listInput.listId = list.id;
            sendEventsToClients(listInput.boardId, listInput);
            return true;
        } catch {
        }
    }
    return false;
}
/*  3.카드 생성 */
async function createCard(userId, cardInput) {
    /* 보드 소유자인지 확인 */
    if(await userHasBoard(userId, cardInput.boardId)) {
        try {
            const card = await Card.create(cardInput);
            /* 클라이언트 갱신 */
            cardInput.model = "CARD";
            cardInput.type = "CREATE";
            cardInput.cardId = card.id;
            sendEventsToClients(cardInput.boardId, cardInput);
            return true;
        } catch {
        }
    }
    return false;    
}

/*  Read */
/*  1.boards 주기 */
async function getBoardList(userId) {
    let user, boards;
    try {
        user =  await User.findByPk(userId);
        boards = await user.getBoards();
    } catch {   
    }
    return boards;
}
/*  2.board 주기 */
async function getBoard(userId, boardId) {
    let board = await userHasBoard(userId, boardId);
    if(board) return board;
    return null;
}

/*  Update */
/*  1.보드 수정 */
async function updateBoard(userId, boardInput) {
    /* 유저가 소유한 보드인지 확인 */
    if(await userHasBoard(userId, boardInput.id)) {
        try {
            await Board.update({
                title: boardInput.title
            }, {
                where: { id: boardInput.id } 
            });
            boardInput.model = "BOARD";
            boardInput.type = "EDIT";
            sendEventsToClients(boardInput.id, boardInput);
            return true;
        } catch {   
        }
    }
    return false;
}
/*  2.리스트 수정 */
async function updateList(userId,  boardId, listId, listInput) {
    /* 유저가 소유한 보드인지 확인 */
    if(await userHasBoard(userId, boardId)) {
        try {
            await List.update(
                listInput, 
                {
                where: { id: listId } 
            });
            listInput.model = "LIST";
            listInput.type = "EDIT";
            listInput.listId = listId;
            sendEventsToClients(boardId, listInput);
            return true;
        } catch {
        }
    }
    return false;
}
/*  3.카드 수정 */
async function updateCard(userId, boardId, cardId, cardInput) {
    /* 유저가 소유한 보드인지 확인 */
    const board = await userHasBoard(userId, boardId);
    if(board) {
        try {
            if(cardInput.index != undefined) await moveOtherCards(cardInput.listId, cardId, cardInput.index);
            await Card.update(
                cardInput, 
                {
                where: { id: cardId } 
            });
            console.log("2");
            cardInput.model = "CARD";
            cardInput.type = "EDIT";
            cardInput.cardId = cardId;
            sendEventsToClients(boardId, cardInput);
            return true;
        } catch {                    
        }
    }
    return false;
}
/* 4. 카드 옮기기 */
async function moveOtherCards(listId, cardId, index) {
    const oldCard = await Card.findByPk(cardId);
    console.log(oldCard.listId+" "+listId);
    console.log(oldCard.index+" "+index);
    if(oldCard.listId == listId) {
        if(oldCard.index < index) {
            await Card.increment(
                { index: -1 },
                { where: {
                    listId: listId,
                    index: {
                        [Op.between]: [oldCard.index+1, index]
                    }
                }}
            );            
        } else {
            await Card.increment(
                { index: 1 },
                { where: {
                    listId: listId,
                    index: {
                        [Op.between]: [index, oldCard.index-1]
                    }
                }}
            ); 
        }
    } else {
        await Card.increment(
            { index: -1 },
            { where: {
                listId: oldCard.listId,
                index: {
                    [Op.gt]: oldCard.index
                }
            }}
        ); 
        await Card.increment(
            { index: 1 },
            { where: {
                listId: listId,
                index: {
                    [Op.gt]: index-1
                }
            }}
        );  
    }
}

/*  Delete */
/*  1.보드 삭제 */
async function removeBoard(userId, boardId) {
    /* 유저가 소유한 보드인지 확인 */
    if(await userHasBoard(userId, boardId)) {
        try {
            await Board.destroy({
                where: { id: boardId } 
            });
            const data = {
                model: "BOARD",
                type: "DELETE"
            };
            sendEventsToClients(boardId, data);
            return true;
        } catch {
        }
    }
    return false;
}
/*  2.리스트 삭제 */
async function removeList(userId, boardId, listId) {
    /* 유저가 소유한 보드인지 확인 */
    const board = await userHasBoard(userId, boardId);
    if(board) {
        /* 보드아이디가 정확한지 확인 */
        const list = await List.findByPk(listId);
        if(await board.hasList(list)) {
            try {
                await List.destroy({
                    where: { id: listId } 
                });
                const data = {
                    model: "LIST",
                    type: "DELETE",
                    listId : listId
                };
                sendEventsToClients(boardId, data);
                return true;
            } catch {                
            }
        }
    }
}
/*  3.카드 삭제 */
async function removeCard(userId, boardId, listId, cardId, index) {
    /* 유저가 소유한 보드인지 확인 */
    try {
        const board = await userHasBoard(userId, boardId);
        if(board) {
            const card = await Card.findByPk(cardId);
            await Card.destroy({
                where: { id: cardId } 
            });
            await Card.increment(
                { index: -1 },
                { where: {
                    listId: listId,
                    index: {
                        [Op.gt]: index
                    }
                }}
            ); 
            const data = {
                model: "CARD",
                type: "DELETE",
                cardId: cardId
            };
            sendEventsToClients(boardId, data);
            return true;
        }

        
    } catch (err) {

    }
    return false;
}

/* Utility */
/* 1.유저가 보드 소유자인지 확인 */
async function userHasBoard(userId, boardId) {
    try {
        let user = await User.findByPk(userId);
        let board = await getFullBoard(boardId);
        if(await user.hasBoard(board)) return board;
    } catch {   
    }
    return null;
}
/* 2.보드를 세부 정보 포함해서 찾기 */
async function getFullBoard(boardId) {
    try {
        return await Board.findOne({
            where: {
                id: boardId
            },
            attributes : ['id', 'title'],
            include: [{
                model: List,
                as: 'lists',
                attributes : ['id', 'title', 'index'],
                required: false,            
                include: [{
                    model: Card,
                    as: 'cards',
                    attributes : ['id', 'content', 'index'],
                    required: false,                }],
            }],
            order: [ 
                [{ model: List, as: 'lists' }, 'index', 'asc'],
                [{ model: List, as: 'lists' }, { model: Card, as: 'cards' }, 'index', 'asc']
            ]
        });
    } catch (err) {
        console.log(err);
    }
    return null;
}
/* 3.변경 사항을 온라인 클라이언트에게 전송 */
function sendEventsToClients(boardId, data) {
    // let board = await getFullBoard(boardId);
    streamRouter.sendEvents(boardId, data);
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