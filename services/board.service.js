const models = require("../models");
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
    try {
        let board = await Board.create(boardInput);
        let user = await User.findByPk(userId);
        await user.addBoard(board);
        return true; 
    } catch {
    }
    return false;
}
/*  2.리스트 생성 */
async function createList(userId, listInput) {
    /* 보드 소유자인지 확인 */
    if(await userHasBoard(userId, listInput.boardId)) {
        try {
            await List.create(listInput);
            /* 클라이언트 갱신 */
            await sendEventsToClients(listInput.boardId);
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
            await Card.create(cardInput);
            console.log('new card');
            /* 클라이언트 갱신 */
            await sendEventsToClients(cardInput.boardId);
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
        try {
            await Board.update({
                title: boardInput.title
            }, {
                where: { id: boardInput.id } 
            });
            await sendEventsToClients(boardInput.id);
            return true;
        } catch {   
        }
    }
    return false;
}
/*  2.리스트 수정 */
async function updateList(userId, listInput) {
    /* 유저가 소유한 보드인지 확인 */
    if(await userHasBoard(userId, listInput.boardId)) {
        try {
            await List.update({
                title: listInput.title,
                index: listInput.index
            }, {
                where: { id: listInput.listId } 
            });
            await sendEventsToClients(listInput.boardId);
            return true;
        } catch {
        }
    }
    return false;
}
/*  3.카드 수정 */
async function updateCard(userId, cardInput) {
    /* 유저가 소유한 보드인지 확인 */
    const board = await userHasBoard(userId, cardInput.boardId);
    if(board) {
        try {
            await Card.update({
                listId: cardInput.listId,
                content: cardInput.content,
                index: cardInput.index
            }, {
                where: { id: cardInput.cardId } 
            });
            await sendEventsToClients(cardInput.boardId);
            return true;
        } catch {                    
        }
    }
    return false;
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
            return true;
        } catch {
        }
    }
    return false;
}
/*  2.리스트 삭제 */
async function removeList(userId, boardId, listId) {
    console.log("ㅎㅇ"+userId+" "+boardId+" "+listId);
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
                await sendEventsToClients(boardId);
                return true;
            } catch {                
            }
        }
    }
}
/*  3.카드 삭제 */
async function removeCard(userId, boardId, listId, cardId) {
    /* 유저가 소유한 보드인지 확인 */
    const board = await userHasBoard(userId, boardId);
    if(board) {
        /* 리스트아이디가 정확한지 확인 */
        const list = await List.findByPk(listId);
        if(await board.hasList(list)) {
            const card = await Card.findByPk(cardId);
            if(list.hasCard(card)) {
                try {
                    await Card.destroy({
                        where: { id: cardId } 
                    });
                    await sendEventsToClients(boardId);
                    return true;
                } catch {                   
                }
            }
        }
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
    console.log("bid"+boardId);
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
                    required: false,
                    // order: [ 
                    //     [Card, 'index', 'asc']
                    // ]           
                }],
                // order: [ 
                //     [{ model: Card, as: 'cards' }, 'index', 'asc']
                // ]

            }],
            order: [ 
                [{ model: List, as: 'lists' }, 'index', 'asc'],
                [{ model: List, as: 'lists' }, { model: Card, as: 'cards' }, 'index', 'asc']
            ]
        });
    } catch {
        console.log("ㅎㅇ");
    }
    return null;
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