import abstractview from "./abstractview.js";

export default class extends abstractview {
    constructor(params) {
        super(params);
        this.setTitle("Haerillo: 보드 리스트");
    }
    
    async render() {
        console.log("boards render");
        try {
            const data = await this.getData();
            if(data) {
                console.log(data);
                document.querySelector(".app").innerHTML = this.Template(data);
            } else {
                // document.querySelector(".app").innerHTML = this.Template();
            }
        } catch(err) {
            console.log("에러"+err);
            // document.querySelector(".app").innerHTML = this.Template();
        }
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
        return `<ul class="boards">
                    ${data.boards.reduce((acc, board) => acc += this.Board(board), '')}
                </ul>`;
    }

    Board(board) {
        return `<li class="board-list">
                    <div class="board-small">
                        <div class="board-small-title">
                            <a href="/board/${board.id}" data-link>제목: ${board.title}</a>
                        </div>
                        <div class="board-small-date">
                            마지막 수정: ${board.updatedAt}
                        </div>
                    </div>
                </li>`;
    }
}