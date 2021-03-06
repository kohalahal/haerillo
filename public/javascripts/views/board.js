import abstractview from "./abstractview.js";
import SSE from "../sse.js";

export default class extends abstractview {
    constructor(params) {
        super(params);
    }

    async render() {
        console.log(this.params);
        console.log(this.params.id);

        try {
            const data = await this.getData(this.params.id);
            if(data) {
                // console.log(data);
                this.setTitle("Haerillo: "+data.board.title);
                document.querySelector(".app").innerHTML = this.Template(data.board);
                this.addEvent();
                window.sse = new SSE(data.streamToken);

                // this.initSSE(data.streamToken);
            } else {
                // document.querySelector(".app").innerHTML = this.Template();
            }
        } catch(err) {
            console.log("에러"+err);
            // document.querySelector(".app").innerHTML = this.Template();
        }
    }

    getData(id) {
        return new Promise(function (resolve, reject) {
            if(!window.localStorage.getItem("token")) {
                return reject();
            }
            const xhr = new XMLHttpRequest();
            const url = "http://localhost:3000/boards/"+id;
            xhr.open('GET', url);
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
            xhr.responseType = 'json';
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    // console.log(xhr.response);
                    resolve(xhr.response);
                } else {
                    window.localStorage.removeItem("token");
                    reject();
                }
            };
            xhr.onerror = function () {  
                reject();
            };
            xhr.send();
        });
    }

    Template(board) {
        return `<div id="board-id" style="display: none;">${board.id}</div>
                <div class="board-title">
                    <h3>${board.title}</h3>
                </div>
                <ul class="list-container">
                    ${board.lists.reduce((acc, list) => acc += this.List(list), '')}
                    <li class="list inactive">
                        <div class="text-container text add-list">
                            + 리스트 등록
                        </div>                    
                    </li>
                <!-- end of list-container -->
                </ul>`;        
    }
    
    List ({id, title, cards}) {
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
                        ${cards.reduce((acc, card) => acc += this.Card(card), '')}                
                        <li class="card">
                            <div class="text-container text add-card">
                                <a class="add-card-btn">+ 카드 등록</a>
                            </div>
                        </li>
                    
                    </ul>
                </li>`;
    }
    
    Card ({id, content}) {
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

    addEvent() {
        console.log("보드페이지에 에드이벤트");
        const addListBtn = document.querySelector('.add-list');    
        addListBtn.addEventListener("click", this.makeListInput);
        const addCardBtn = document.querySelectorAll('.add-card');
        addCardBtn.forEach((btn) => {
            btn.addEventListener("click", this.makeCardInput);        
        });
    }
    
    makeListInput(event) {
        event.target.innerHTML = `<input type="text" name="list">
                                <a class="list-ok-btn" onclick="addList()">OK</a>`;
        event.target.removeEventListener("click", this.makeListInput);
    }
    
    makeCardInput(event) {
        event.target.innerHTML = `<textarea class="card-input"></textarea>
                            <div class="ok-btn-container">
                                <a class="ok-btn" onclick="addCard.call(this)">OK</a>
                            </div>`;
        event.target.removeEventListener("click", this.makeCardInput);    
    }

    
}