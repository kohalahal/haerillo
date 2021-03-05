const User = require("../models").users;
const bcrypt = require('bcrypt');

/* 목차
    -DONE-
    1.유저네임 중복 체크
    2.이메일 중복 체크
    3.가입
    
    -TODO-
    4.비밀번호 변경
*/

/* 1.유저네임 중복 체크 */
async function checkUsername(username) {
    let user;
    try {
        user = await User.findOne({ where: { username } });
        /* 유저네임으로 가입된 유저 발견 : 유저 네임 사용할 수 없음*/
        if(user) return false;
    } catch(error) {
        console.log(error);
    }    
    return true;
}

/* 2.이메일 중복 체크 */
async function checkEmail(email) {
    let user;
    try {
        user = await User.findOne({ where: { email } });
        /* 이메일로 가입된 유저 발견 : 이메일 사용할 수 없음 */
        if(user) return false;
    } catch(error) {
        console.log(error);
    }
    return true;
}

/* 3.회원 가입 */
async function register(userInput) {
    userInput.password = bcrypt.hashSync(userInput.password, 10);
    //유저 생성(username, email 중복 시 실패)
    let user = await User.create(userInput);
    if(user) {
         // 가입 성공
         console.log('가입성공');
         return true;
    } else {
        // 실패
        console.log('가입실패');
        return false;
    }	
}

exports.register = register;
exports.checkUsername = checkUsername;
exports.checkEmail = checkEmail;
