const express = require('express');
const router = express.Router();
const http = require('http-status-codes');
const jwt = require("jsonwebtoken");
const authConfig = require('../config/auth.config');
const boardService = require('../services/board.service');

const boards = {};

function sendEvents(boardId, data) {
    if(!boards[boardId]) {
        boards[boardId] = [];
    }
    boards[boardId].forEach((board) => {
        console.log("데이터보내기");
        // board.res.write(`data: `+data+`\n\n`);
        board.res.write(`data: ${JSON.stringify(data)} \n\n`);
    });
}

router.get('/:boardId', async (req, res) => {
    let boardId = req.params.boardId;
    if(!boards[boardId]) {
        console.log('배열 생성:'+boardId);
        boards[boardId] = [];
    }
    boards[boardId].push({
        id: boardId,
        res
    });
    res.setHeader("Content-Type", "text/event-stream");
    console.log('stream new boardId;'+boardId);
    console.log('board 클라언트 length:'+boards[boardId].length);
    if(!boardId) {      
        res.status(http.StatusCodes.UNAUTHORIZED).json('보드에 권한이 없습니다.');
    }
    // let board = await boardService.getBoardStream(boardId);
    // console.log('받은 보드:'+board);
    // if(board) {
    //   console.log('ㅇㅋ');
    //   res.setHeader("Content-Type", "text/event-stream");
    //   res.write(board+'\n\n');
    //   // res.status(http.StatusCodes.OK).json(board);
    // } else {
    //   console.log('ㄴㄴ');
    //   res.status(http.StatusCodes.UNAUTHORIZED).json('보드에 권한이 없습니다.');
    // }
    res.write('data: '+'ok\n\n');
    req.on("close", () => {
        console.log(`${boardId} Connection closed`);
        boards[boardId] = boards[boardId].filter((board) => board.id !== boardId);
    })
  });


module.exports = router;
module.exports.sendEvents = sendEvents;