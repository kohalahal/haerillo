/* TODO(브라우저 입장)

1.보드 정보를 겟한다.
오류나면 알린다

2.보드 정보를  html 로 뿌린다.



*/


let board;
(function() {
    //쿼리에서 보드 아이디 가져오기
    const lists = document.querySelectorAll('.list');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    //숫자인지 체크
    if(isNaN(id)) {
        //잘못된 접근

    }
    console.log(queryString);
    console.log(urlParams);
    console.log(id);
    const url = 'http://localhost:3000/boards/'+id;
    console.log(url);
    const getBoard = function(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
        xhr.responseType = 'json';
        xhr.onload = function() {
            const status = xhr.status;
          if (status === 200) {
            callback(null, xhr.response);
          } else {
            callback(status, xhr.response);
          }
        };
        xhr.send();
    };
    getBoard(url, (err, data) => {
        if(err) {
            alert('Something went wrong: ' + err);
        } else {
            board = data;
            console.log(data);
            document.querySelector('.board').innerHTML = Board(board);
            addEvent();
        }
    });


    

    
})();


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
    return `<li class="list">
                <div class="text-container">
                    <div class="delete-btn">
                        <a class="list-delete-${id}"><i class="fas fa-trash-alt "></i></a>
                    </div>
                    <div class="list-title text">
                        <h4>${title}</h4>
                    </div>                
                </div>
                <ul class="card-container">
                    ${cards.reduce((acc, card) => acc += Card(card), '')}
                
                    <li class="card">
                        <div class="text-container">
                        <textarea class="list-input"></textarea>
                        <div class="ok-btn-container">
                            <a class="ok-btn">OK</a>
                        </div>
                        </div>
                    </li>
                
                </ul>
            </li>`;
}

function Card ({id, content}) {
    return `<li class="card active">
                <div class="delete-btn">
                    <a class="card-delete ${id}"><i class="fas fa-trash-alt"></i><a>
                </div>
                <div class="text-container">
                    <div class="card-content text">
                        ${content}
                    </div>                
                </div>
            </li>`;
}



function addEvent() {
    const boardId = document.querySelector('#board-id').innerText;
    const addListBtn = document.querySelector('.add-list');
    
    addListBtn.addEventListener("click", makeListInput);

    function makeListInput() {
    addListBtn.innerHTML = `<input type="text" name="list">
                            <a class="list-ok-btn" onclick="addList()">OK</a>`;
    addListBtn.removeEventListener("click", makeListInput);
    }


    



}

function addList() {
    const title = document.querySelector('input[name="list"]').value;
    addlistevent = this;
    // const index;
    const index = lists.length;
    const list = new List(boardId, title, index);
    console.log(title, boardId, index);
    console.log(list);
    const url = "http://localhost:3000/boards/lists"

    
    createList(url, (err, message) => {
        if(err) {
            alert('Something went wrong: ' + err);
        } else {
            console.log(message);
        }
    });
}

// function List(boardId, title, index) {
//     this.boardId = boardId;
//     this.title = title;
//     this.index = index;
// }

const createList = function(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
    xhr.responseType = 'json';
    xhr.onload = function() {
        const status = xhr.status;
    if (status === 200) {
        callback(null, xhr.response);
    } else {
        callback(status, xhr.response);
    }
    };
    xhr.send();
};

