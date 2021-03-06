
const url = "http://localhost:3000/boards/";
console.log("1");
const boardId = getBoardId();
let board;
let sse;
console.log(boardId);
getBoard(boardId).then((message) => {
    console.log(message+' 겟보드 ㅇㅋ');
})
.catch((message) => {
    console.log(message+' 겟보드 실패');
});





































function getBoardId() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    return id;
}

function getBoard(boardId) {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        
        xhr.open('GET', url+boardId);
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
        xhr.responseType = 'json';
        console.log("3");
        xhr.onload = function () {
            console.log("온로드");
            if (this.status >= 200 && this.status < 300) {
                console.log(xhr.response);
                console.log("4");
                render(xhr.response.board);
                initSSE(xhr.response.streamToken);
                console.log("5");
                resolve(xhr.response);
            } else {
                console.log("err");
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            console.log("err"+xhr.response.message);

            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
        console.log("6");

    });
};


function initSSE(token) {
    console.log("token:"+token)
    const url = "http://localhost:3000/stream/"+token;
    console.log("url"+url);
    sse = new EventSource(url);

    sse.onopen = function() {
        console.log("Connection to server opened.");
    };

    sse.onclose = function() {
        console.log("SSE CLOSE");
    }

    sse.onerror = function() {
        console.log('sse error');
    }
    
    sse.onmessage = function(event) {
        console.log('sse!');
        console.log(event.data);
        render(JSON.parse(event.data));
    };    
}

function render(board) {
    document.querySelector('.board').innerHTML = Board(board);
    addEvent();
}

function addEvent() {
    const addListBtn = document.querySelector('.add-list');    
    addListBtn.addEventListener("click", makeListInput);
    const addCardBtn = document.querySelectorAll('.add-card');
    addCardBtn.forEach((btn) => {
        btn.addEventListener("click", makeCardInput);        
    });
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
    const title = document.querySelector('input[name="list"]').value;
    const index = document.querySelectorAll('.list').length;
    const list = { board_id: boardId, title: title, index: index };
    console.log(boardId, title, index);
    console.log(list);
    makeRequest("POST", url+"/lists", list).then((data) => {
        refresh();
    });
}

function addCard() {
    const list = this.closest('.list');
    const listId = list.firstElementChild.innerText;
    const content = list.querySelector('textarea').value;
    const index = list.querySelectorAll('.card').length;
    const card = { board_id: boardId, list_id: listId, content: content , index: index };
    console.log(listId, content, index);
    makeRequest("POST", url+"/lists/cards", card).then((data) => {
        refresh(data.message);
    });
}

function refresh(message) {
    sse.close();
    getBoard(boardId).then(() => {
        console.log('message'+'겟보드 ㅇㅋ');
    })
    .catch(() => {
        console.log('message'+'겟보드 실패');
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

function Board ({id, title, lists}) {
    return `<div id="board-id" style="display: none;">${id}</div>
            <div class="board-title">
                <h3>${title}</h3>
            </div>
            <ul class="list-container">
                ${lists.reduce((acc, list) => acc += List(list), '')}
                <li class="list inactive">
                    <div class="text-container text add-list">
                        + 리스트 등록
                    </div>                    
                </li>
            <!-- end of list-container -->
            </ul>`;
}

function List ({id, title, cards}) {
    return `<li class="list ${id}">
                <div class="list-id" style="display: none;">${id}</div>
                <div class="text-container">
                    <div class="delete-btn">
                        <a class="list-delete"><i class="fas fa-trash-alt "></i></a>
                    </div>
                    <div class="list-title text">
                        <h4>${title}</h4>
                    </div>                
                </div>
                <ul class="card-container">
                    ${cards.reduce((acc, card) => acc += Card(card), '')}                
                    <li class="card">
                        <div class="text-container text add-card">
                            <a class="add-card-btn">+ 카드 등록</a>
                        </div>
                    </li>
                
                </ul>
            </li>`;
}

function Card ({id, content}) {
    return `<li class="card active">
                <div id="card-id" style="display: none;">${id}</div>
                <div class="delete-btn">
                    <a class="card-delete"><i class="fas fa-trash-alt"></i><a>
                </div>
                <div class="text-container">
                    <div class="card-content text">
                        ${content}
                    </div>                
                </div>
            </li>`;
}
