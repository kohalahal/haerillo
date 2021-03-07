const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');

const streamTokenArray = [];

/* 목차

    1.로그인 토큰
        1.1 생성(auth 서비스에서 사용)

    2.스트림 토큰
        2.1 생성 (스트림 라우터에서 사용)
        2.2 토큰 재사용 막으면서 디코드하기 (스트림 라우터에서 사용)
        2.3 토큰 유효성 확인, 재사용 막기 
        2.4 어레이에서 토큰 삭제
        
*/

/* 1. 로그인 토큰 */
/* 1.1 생성(auth 서비스에서 사용) */
function generateLoginToken(id, username) {
    return jwt.sign({
        id: id, 
        username : username
    }, // 토큰에 입력할 private 값
    jwtConfig.secret, // 나만의 시크릿키
    { expiresIn: "15h" } // 토큰 만료 시간
    );
}

/* 2. 스트림 토큰 */
/* 2.1 생성 (스트림 라우터에서 사용) */
function generateStreamToken(boardId) {
    let streamToken = jwt.sign({
        id: boardId
    }, // 토큰에 입력할 private 값
    jwtConfig.streamSecret,
    { expiresIn: "10s" } // 토큰 만료 시간
    );
    streamTokenArray.push(streamToken);
    setTimeout(removeToken, 10000);
    return streamToken;
}
/* 2.2 토큰 재사용 막으면서 디코드하기 (스트림 라우터에서 사용)*/
function getBoardIdFromToken(token) {
    if(!verifyStreamToken) {
        throw new Error();
    }
    let decoded;
    try {
        decoded = jwt.verify(token, jwtConfig.streamSecret);
        return decoded.id;
    } catch (error) {
        console.log(error);
    }
}
/* 내부 메소드 */
/* 2.3 토큰 유효성 확인, 재사용 막기 */
function verifyStreamToken(token) {
    let index = streamTokenArray.indexOf(token);
    if(index > -1) {
        removeToken(token)
        return true;
    } 
    return false;
}
/* 2.4 어레이에서 토큰 삭제 */
function removeToken(token) {
    let index = streamTokenArray.indexOf(token);
    streamTokenArray.splice(index, 1);
}

exports.generateLoginToken = generateLoginToken;
exports.generateStreamToken = generateStreamToken;
exports.getBoardIdFromToken = getBoardIdFromToken;
