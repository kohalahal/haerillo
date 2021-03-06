function join() {
    const username = document.querySelector("input[name=username]").value;
    const email = document.querySelector("input[name=email]").value;
    const password = document.querySelector("input[name=password]").value;
    if(!username || !email || !password) {
        /* 모달:입력 부족안내 */
        return;
    }
    console.log(username, password);
    const data = {
        username,
        email,
        password
    };
    post("join", data).then((res) => {
        console.log(res.message);
        goToIndex();
    }).catch((res) => {
        /* 모달:로그인 실패 */
        console.log(res.message); // or undefined
    });
}

function login() {
    const username = document.querySelector("input[name=username]").value;
    const password = document.querySelector("input[name=password]").value;
    if(!username || !password) {
        /* 모달:입력 부족안내 */
        return;
    }
    console.log(username, password);
    const data = {
        username,
        password
    };
    post("login", data).then((res) => {
        window.localStorage.setItem("token", res.token);
        goToIndex();
    }).catch((res) => {
        /* 모달:로그인 실패 */
        console.log(res.message); // or undefined
    });
}

function logout() {
    window.localStorage.removeItem("token");
    goToIndex();
}

function post(path, data) {
    console.log(JSON.stringify(data));
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

function goToIndex() {
    document.querySelector("#logo").click();
}

function makeListInput(event) {
    event.target.innerHTML = `<input type="text" name="list">
                            <a class="list-ok-btn" onclick="addList()">OK</a>`;
    event.target.removeEventListener("click", makeListInput);
}

function makeCardInput(event) {
    event.target.innerHTML = `<textarea class="card-input"></textarea>
                        <div class="ok-btn-container">
                            <a class="ok-btn" onclick="addCard.call(this)">OK</a>
                        </div>`;
    event.target.removeEventListener("click", makeCardInput);    
}

function addList() {
    const boardId = document.querySelector("#board-id").innerText;
    const title = document.querySelector('input[name="list"]').value;
    const index = document.querySelectorAll('.list').length;
    const list = { board_id: boardId, title: title, index: index };
    console.log(boardId, title, index);
    console.log(list);
    makeRequest("POST", "http://localhost:3000/boards/lists", list).then((data) => {
        refresh();
    });
}

function addCard() {
    const boardId = document.querySelector("#board-id").innerText;
    const list = this.closest('.list');
    const listId = list.firstElementChild.innerText;
    const content = list.querySelector('textarea').value;
    const index = list.querySelectorAll('.card').length;
    const card = { board_id: boardId, list_id: listId, content: content , index: index };
    console.log(listId, content, index);
    makeRequest("POST", "http://localhost:3000/boards/lists/cards", card).then((data) => {
        refresh(data.message);
    });
}

function makeRequest(method, url, data) {    
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.responseType = 'json';
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send(JSON.stringify(data));
    });
}