import abstractview from "./abstractview.js";

export default class extends abstractview {
    constructor(params, modal) {
        super(params, modal);
        this.setTitle("Haerillo: 보드 리스트");        
    }

    Board = this.boardTemplate.bind(this);

    async init() {
        try {
            const data = await this.getData();
            if(data) {
                this.render(data);
                return;
            } 
        } catch(err) {
            console.log(err);
        }
        window.modal.alertLogin();
    }

    getData() {
        return new Promise(function (resolve, reject) {
            if(!window.localStorage.getItem("token")) {
                return reject();
            }
            const xhr = new XMLHttpRequest();
            const url = "http://localhost:3000/boards"            
            xhr.open('GET', url);
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
            xhr.responseType = 'json';
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    console.log(xhr.response);
                    console.log(xhr.response.boards);
                    console.log(xhr.response.message);
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

    Template(data) {
        return `<div class="boards">
                    <ul>
                        <li class="board add-board pointer" onclick="createBoard();">
                            <div class="board-small">
                                <div class="board-small-title">
                                    <h3>
                                        <i class="fas fa-folder-plus"></i>
                                        새로운 보드
                                    </h3>
                                </div>

                            </div>
                        </li>
                        ${data.boards.reduce((acc, board) => acc += this.Board(board), '')}
                    </ul>
                </div>`;
    }
    boardTemplate(board) {
        return `<a href="/board/${board.id}" data-link>
                    <li class="board shadow border">
                        <div class="board-small">
                            <div class="board-small-title">
                                <h3>
                                    ${this.cutLongText(board.title)}
                                </h3>
                            </div>
                            <div class="board-small-date">
                                created at ${this.dateFormat(board.createdAt)}
                            </div>
                            <div class="board-small-date">
                                updated at ${this.dateFormat(board.updatedAt)}
                            </div>
                        </div>
                    </li>
                </a>`;
    }
    cutLongText(data) {
        if(data.length>20) {
            return data.slice(0, 20)+"...";
        }
        return data;
    }
    dateFormat(data) {
        const date = new Date(data);
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        month = month < 10 ? "0"+month : month;
        let day = date.getDate();
        day = day < 10 ? "0"+day : day;
        return year+"."+month+"."+day;
    }
}