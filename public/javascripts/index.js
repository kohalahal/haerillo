import Modal from "./views/modal.js";

const modal = new Modal();
const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

window.join = join;
window.login = login;
window.logout = logout;
window.createBoard = createBoard;
window.deleteBoard = deleteBoard;

function goToIndex() {
    document.querySelector("#logo").click();
}

function join() {
    const username = document.querySelector("input[name=username]").value;
    if(!username) {
        modal.simple("유저네임을 입력해주세요.");
        return;
    }
    const email = document.querySelector("input[name=email]").value;
    if(!email.match(mailformat)) {
        modal.simple("이메일을 정확히 입력해주세요.");
        return;
    }
    const password = document.querySelector("input[name=password]").value;
    if(!password) {
        modal.simple("패스워드를 입력해주세요.");
        return;
    }
    const passwordComfirm = document.querySelector("input[name=passwordCofrim]").value;
    if(!passwordComfirm) {
        modal.simple("확인용 패스워드를 입력해주세요.");
        return;
    }
    if(password!=passwordComfirm) {
        modal.simple("패스워드가 서로 일치하지 않습니다.");
        return;
    }
    const data = {
        username,
        email,
        password
    };
    request("POST", "auth/join", data, false).then((res) => {
        modal.simple(res.message);
        goToIndex();
    }).catch((res) => {
        modal.simple(res.message);
    });
}

function login() {
    const username = document.querySelector("input[name=username]").value;
    const password = document.querySelector("input[name=password]").value;
    if(!username) {
        modal.simple("유저네임을 입력해주세요.");
        return;
    }
    if(!password) {
        modal.simple("패스워드를 입력해주세요.");
        return;
    }
    const data = {
        username,
        password
    };
    request("POST", "auth/login", data, false).then((res) => {
        window.localStorage.setItem("token", res.token);
        goToIndex();
        if(res && res.message) modal.simple(res.message);
    }).catch(() => {
        if(res && res.message) modal.simple(res.message);

    });
}

function logout() {
    window.localStorage.removeItem("token");
    modal.simple("로그아웃하셨습니다.");
    goToIndex();
}

function createBoard() {
    request("POST", "boards", null, true).then((data) => {
        window.location = "http://localhost:3000/board/"+data.boardId;
        modal.simple(data.message);
    }).catch(() => {
        modal.alertTryAgain();
    });
}

function deleteBoard(boardId) {
    if(!confirm("보드를 정말로 삭제하시겠습니까?")) return;
    request("DELETE", "boards/"+boardId, null, true).then((data) => {
        document.querySelector("[href='/board']").click();
        modal.simple(data.message);
    }).catch(() => {
        modal.alertTryAgain();
    });
}

function request(method, path, data, needAuthentication) {
    return new Promise(function (resolve, reject) {
        const url = "http://localhost:3000/"+path;
        const xhr = new XMLHttpRequest();
        let input = JSON.stringify(data);
        xhr.open(method, url);
        if(needAuthentication) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
            input = undefined;
        }
        JSON.stringify(data)
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.response);
            }
        };
        xhr.onerror = function () {
            reject();
        };
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.responseType = 'json';
        xhr.send(input);
    });
}
