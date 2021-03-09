const express = require('express');
const router = express.Router();
const http = require('http-status-codes');
const jwtUtility = require('../utility/jwt.utility');

const onlineClients = {};

/* 목차
    SSE
    1./stream/:token GET 리퀘스트 셋업
    2.온라인 클라이언트에 이벤트로 보드 보내기(보드 서비스에서 사용)

    Utility
    1. 온라인 클라이언트 등록
    2. 온라인 클라이언트 삭제 
*/

/* SSE */
/* 1.GET 리퀘스트 셋업*/
router.get('/:token', async (req, res) => {
    let token = req.params.token;
    try {
        let boardId = jwtUtility.getBoardIdFromToken(token);        
        /* 온라인 클라이언트에 res 등록 */
        addToOnlineClients(boardId, token, res);    

        /* SSE 리스폰스 설정 */
        res.setHeader("Content-Type", "text/event-stream");
        res.flushHeaders();
        
        /* 리퀘스트 끝났을 때 */
        req.on("close", () => {
            /* 온라인 클라이언트에서 삭제 */
            removeOnlineClient(boardId, token);
        });
    } catch (err) {
        /* 유효하지 않은 스트림 토큰 */
        console.log('stream 실패');
        return res.status(http.StatusCodes.UNAUTHORIZED).json({ message: '권한이 없습니다.' });
    }
});

/* 2.온라인 클라이언트에 이벤트로 보드 보내기(보드 서비스에서 사용) */
function sendEvents(boardId, data) {
    if(!onlineClients[boardId]) {
        onlineClients[boardId] = [];
    }
    onlineClients[boardId].forEach((client) => {
        client.res.write(`data: ${JSON.stringify(data)} \n\n`);
    });
}

/* Utility */
/* 1. 클라이언트 등록 */
function addToOnlineClients(boardId, token, res) {
    if(!onlineClients[boardId]) {
        onlineClients[boardId] = [];
    }
    onlineClients[boardId].push({
        token: token,
        res
    });
}

/* 2. 클라이언트 삭제 */
function removeOnlineClient(boardId, token) {
    onlineClients[boardId] = onlineClients[boardId].filter((board) => 
    board.token !== token);
}

module.exports = router;
module.exports.sendEvents = sendEvents;