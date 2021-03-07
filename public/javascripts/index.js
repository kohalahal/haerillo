import Modal from "./views/modal.js";

const modal = new Modal();
window.join = join;
window.login = login;
window.logout = logout;


function goToIndex() {
    document.querySelector("#logo").click();
}

function join() {
    const username = document.querySelector("input[name=username]").value;
    const email = document.querySelector("input[name=email]").value;
    const password = document.querySelector("input[name=password]").value;
    if(!username) {
        modal.simple("유저네임을 입력해주세요.");
        return;
    }
    if(!email) {
        modal.simple("이메일을 입력해주세요.");
        return;
    } 
    if(!password) {
        modal.simple("패스워드를 입력해주세요.");
        return;
    }
    const data = {
        username,
        email,
        password
    };
    post("join", data).then((res) => {
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
    post("login", data).then((res) => {
        window.localStorage.setItem("token", res.token);
        modal.simple("로그인 성공");
        goToIndex();
    }).catch((res) => {
        modal.simple(res.message);
    });
}

function logout() {
    window.localStorage.removeItem("token");
    modal.simple("로그아웃하셨습니다.");
    goToIndex();
}

function post(path, data) {
    return new Promise(function (resolve, reject) {
        const url = "http://localhost:3000/auth/"+path;
        const xhr = new XMLHttpRequest();        
        xhr.open('POST', url);
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
        xhr.send(JSON.stringify(data));
    });
}
