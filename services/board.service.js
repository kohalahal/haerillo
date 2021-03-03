const User = require("../models").users;
const Board = require("../models").boards;
const List = require("../models").lists;
const Card = require("../models").cards;




/* TODO :

    db crud 실패하면! 오류만들기.

    Create
    1.보드 등록
    2.리스트 등록
    3.카드 등록

    Read
    1.보드 목록 주기
    2.보드 정보 주기
      
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




/*  Create */
/*  1.보드 생성 */
async function createBoard(boardInput, userId) {
    /* 보드를 만들고, 쟉성자 유저와 연관관계 설정 */
    let board = await Board.create(boardInput);
    let user = await User.findOne({ where: userId });
    await user.addBoard(board);
    console.log('new board');
    return true;
 
}
/*  2.리스트 생성 */
async function createList(listInput) {
    let list = await List.create(listInput);
    console.log('new list');
    return true;
}
/*  3.카드 생성 */
async function createCard(cardInput) {
    let card = Card.create(cardInput);
    console.log('new card');
    return true;
}

/*  Read */
/*  1.보드 목록 주기 */
async function getBoardList(userId) {
    let user, boards;
    user = await User.findOne({
        where: {
            id: userId
          }
    });
    boards = await user.getBoards();
    return boards;
}
/*  2.보드 정보 주기 */
async function getBoard(userId, boardId) {
    let user, board;
    user = await User.findOne({
        where: {
            id: userId
        }
    });
    board = await Board.findOne({
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
    console.log(board);
    if(await user.hasBoard(board)) return board;
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




exports.createBoard = createBoard;
exports.createList = createList;
exports.createCard = createCard;
exports.getBoardList = getBoardList;
exports.getBoard = getBoard;