import abstractview from "./abstractview.js";
import Modal from "./modal.js";
import SSE from "../sse.js";
// import Drag from "../drag.js";

export default class extends abstractview {
    constructor(params) {
        super(params);

        this.boardTitle = "";
        this.listTitle = "";
        this.cardContent = "";
        
        this.activeListEditor = null;
        this.activeListInput = null;
        this.activeCardEdior = null;
        this.activeCardInput = null;
        window.modal = new Modal();
        
    }

    editBoardEventAction = this.makeBoardEditor.bind(this);
    editListEventAction = this.makeListEditor.bind(this);
    editCardEventAction = this.makeCardEditor.bind(this);

    cancelEditBoardEventAction = this.removeBoardEditor.bind(this);
    cancelEditListEventAction = this.removeListEditor.bind(this);
    cancelEditCardEventAction = this.removeCardEditor.bind(this);

    addListEventAction = this.makeListInput.bind(this);
    addCardEventAction = this.makeCardInput.bind(this);
    
    cancelAddListEventAction = this.removeListInput.bind(this);
    canceladdCardEventAction = this.removeCardInput.bind(this);

    createList = this.createListRequest.bind(this);
    createCard = this.createCardRequest.bind(this);

    updateBoard = this.updateBoardRequest.bind(this);
    updateList = this.updateListRequest.bind(this);
    updateCard = this.updateCardRequest.bind(this);
    moveCard = this.moveCardRequest.bind(this);

    deleteList = this.deleteListRequest.bind(this);
    deleteCard = this.deleteCardRequest.bind(this);

    async render() {
        try {
            const data = await this.getData(this.params.id);
            if(data) {
                document.querySelector(".app").innerHTML = this.Template(data.board);
                this.setTitle("Haerillo : "+data.board.title);
                this.addEvent();
                window.sse = new SSE(data.streamToken);
            } else {
                window.modal.login();
                console.log("에러"+err);
            }
        } catch(err) {
            window.modal.forbidden();
            console.log("에러"+err);
        }
    }

    getData(id) {
        return new Promise(function (resolve, reject) {
            if(!window.localStorage.getItem("token")) {
                window.modal.login;
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
                    reject();
                }
            };
            xhr.onerror = function () {  
                reject();
            };
            xhr.send();
        });
    }

    addEvent() {
        document.querySelector(".board-title").addEventListener("click", this.editBoardEventAction);
        document.querySelectorAll(".list-title").forEach((element) => {
            element.addEventListener("click", this.editListEventAction); 
        });
        document.querySelectorAll(".card-content").forEach((element) => {
            element.addEventListener("click", this.editCardEventAction); 
        });
        document.querySelector('.add-list').addEventListener("click", this.addListEventAction);
        document.querySelectorAll('.add-card').forEach((element) => {
            element.addEventListener("click", this.addCardEventAction); 
        });
        document.querySelectorAll(".list-delete").forEach((element) => {
            element.addEventListener("click", this.deleteList);
        });
        document.querySelectorAll(".card-delete").forEach((element) => {
            element.addEventListener("click", this.deleteCard);
        });
        document.querySelectorAll('.card.active').forEach(card => {
            card.addEventListener('dragstart', () => {
                card.classList.add('dragging');
            });
            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
                this.moveCard(card);
            });
        });
        document.querySelectorAll('.card-container').forEach(list => {
            list.addEventListener('dragover', e => {
                e.preventDefault();
                const afterElement = this.getDragAfterElement(list, e.clientY);
                // console.log(afterElement);
                const card = document.querySelector('.dragging');
                if (afterElement == null) {
                    list.appendChild(card);
                } else {
                    list.insertBefore(card, afterElement);
                    
                }
            });
        });
    }

    makeBoardEditor(event) {
        if(event) event.stopPropagation();
        const board = event.target.closest(".board-title");
        board.removeEventListener("click", this.editBoardEventAction);
        board.classList.remove("pointer");
        const text = board.innerText;        
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("value", text);
        const div = document.createElement("div");
        div.classList.add("ok-btn-container");
        const cancelbtn = document.createElement("a");
        cancelbtn.innerText = "취소";
        cancelbtn.classList.add("cancel-btn");
        cancelbtn.addEventListener("click", this.cancelEditBoardEventAction);
        const okbtn = document.createElement("a");
        okbtn.innerText = "OK";
        okbtn.classList.add("ok-btn");
        okbtn.addEventListener("click", this.updateBoard);
        div.appendChild(cancelbtn);
        div.appendChild(okbtn);
        board.innerText = "";
        board.appendChild(input);     
        board.appendChild(div);     
        this.boardTitle = text;
    }
    makeListEditor(event) {
        if(event) event.stopPropagation();
        if(this.activeListEdior) {
            this.cancelEditListEventAction();
        }
        if(this.activeListInput) {
            this.cancelAddListEventAction();
        }
        const list = event.target.closest(".list-title");
        list.removeEventListener("click", this.editListEventAction);
        list.classList.remove("pointer");
        list.closest(".text-container").querySelector(".delete-btn").classList.remove("hover");
        const text = list.innerText;
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("value", text);
        const div = document.createElement("div");
        div.classList.add("ok-btn-container");
        const cancelbtn = document.createElement("a");
        cancelbtn.innerText = "취소";
        cancelbtn.classList.add("cancel-btn");
        cancelbtn.addEventListener("click", this.cancelEditListEventAction);
        const okbtn = document.createElement("a");
        okbtn.innerText = "OK";
        okbtn.classList.add("ok-btn");
        okbtn.addEventListener("click", this.updateList);
        div.appendChild(cancelbtn);
        div.appendChild(okbtn);
        list.innerText = "";
        list.appendChild(input);     
        list.appendChild(div); 
        this.activeListEdior = input;
        this.listTitle = text;
    }
    makeCardEditor(event) {
        if(event) event.stopPropagation();
        if(this.activeCardEdior) {
            this.cancelEditCardEventAction();
        }
        const card = event.target.closest(".card-content");
        card.removeEventListener("click", this.editCardEventAction);        
        card.classList.remove("pointer");
        card.closest(".card").querySelector(".delete-btn").classList.remove("hover");
        const text = card.innerText;
        const textarea = document.createElement("textarea");
        textarea.classList.add("card-input");
        textarea.value = text;
        const div = document.createElement("div");
        div.classList.add("ok-btn-container");
        const cancelbtn = document.createElement("a");
        cancelbtn.innerText = "취소";
        cancelbtn.classList.add("cancel-btn");
        cancelbtn.addEventListener("click", this.cancelEditCardEventAction);
        const okbtn = document.createElement("a");
        okbtn.innerText = "OK";
        okbtn.classList.add("ok-btn");
        okbtn.addEventListener("click", this.updateCard);
        div.appendChild(cancelbtn);
        div.appendChild(okbtn);
        event.target.innerText = "";
        event.target.appendChild(textarea);     
        event.target.appendChild(div); 
        this.activeCardEdior = card;
        this.cardContent = text;
    }
    removeBoardEditor(event) {
        if(event) event.stopPropagation();
        const board = event.target.closest(".board-title");
        board.classList.add("pointer");
        const title = document.createElement("h3");
        title.innerText = this.boardTitle;
        board.innerHTML = "";
        board.appendChild(title);
        board.addEventListener("click", this.editBoardEventAction);
    }
    removeListEditor(event) {
        if(event) event.stopPropagation();
        const list = this.activeListEdior.closest(".list-title");
        list.classList.add("pointer");
        const title = document.createElement("h4");
        title.innerText = this.listTitle;
        list.innerHTML = "";
        list.appendChild(title);
        list.addEventListener("click", this.editListEventAction);
        list.closest(".text-container").querySelector(".delete-btn").classList.add("hover");
        this.activeListEdior = null;
    }
    removeCardEditor(event) {        
        if(event) event.stopPropagation();
        const card = this.activeCardEdior.closest(".card-content");
        card.classList.add("pointer");
        card.innerHTML = "";
        card.innerText = this.cardContent;
        card.addEventListener("click", this.editCardEventAction);
        card.closest(".card").querySelector(".delete-btn").classList.add("hover");
        this.activeCardEdior = null;
    }
    makeListInput(event) {
        if(event) event.stopPropagation();
        if(this.activeListEdior) {
            this.cancelEditListEventAction();
        }
        const list = event.target.closest(".add-list");
        list.removeEventListener("click", this.addListEventAction);
        list.classList.remove("pointer");
        list.innerText = "";
        const input = document.createElement("input");
        input.setAttribute('type', 'text');
        input.classList.add("list-input");
        const div = document.createElement("div");
        div.classList.add("ok-btn-container");
        const cancelbtn = document.createElement("a");
        cancelbtn.innerText = "취소";
        cancelbtn.classList.add("cancel-btn");
        cancelbtn.addEventListener("click", this.cancelAddListEventAction);
        const okbtn = document.createElement("a");
        okbtn.innerText = "OK";
        okbtn.classList.add("ok-btn");
        okbtn.addEventListener("click", this.createList);
        div.appendChild(cancelbtn);
        div.appendChild(okbtn);
        list.appendChild(input);
        list.appendChild(div);
        this.activeListInput = list;
    }    
    makeCardInput(event) {
        if(event) event.stopPropagation();
        let value = "";
        if(this.activeCardInput) {
            value = this.activeCardInput.value;
            this.canceladdCardEventAction();
        }
        const card = event.target.closest(".add-card");
        card.removeEventListener("click", this.addCardEventAction);
        card.classList.remove("pointer");
        card.innerText = "";
        const textarea = document.createElement("textarea");
        textarea.classList.add("card-input");
        textarea.value = value;
        const div = document.createElement("div");
        div.classList.add("ok-btn-container");
        const cancelbtn = document.createElement("a");
        cancelbtn.innerText = "취소";
        cancelbtn.classList.add("cancel-btn");
        cancelbtn.addEventListener("click", this.canceladdCardEventAction);
        const okbtn = document.createElement("a");
        okbtn.innerText = "OK";
        okbtn.classList.add("ok-btn");
        okbtn.addEventListener("click", this.createCard);
        div.appendChild(cancelbtn);
        div.appendChild(okbtn);
        card.appendChild(textarea);
        card.appendChild(div);
        this.activeCardInput = textarea;
    }
    removeListInput(event) {
        if(event) event.stopPropagation();
        const list = document.querySelector(".add-list");
        list.innerText = "+ 리스트 등록"
        list.classList.add("pointer");
        list.addEventListener("click", this.addListEventAction);
    }
    removeCardInput(event) {
        if(event) event.stopPropagation();
        const card = this.activeCardInput.closest(".add-card");
        card.innerText = "+ 카드 등록";
        card.addEventListener("click", this.addCardEventAction);
        card.classList.add("pointer");
        this.activeCardInput = null;
    }

    updateBoardRequest(event) {
        const boardId = document.querySelector("#board-id").innerText;
        const title = document.querySelector(".board-title").querySelector('input').value;
        const boardInput = { title: title };
        this.makeRequest("PUT", "http://localhost:3000/boards/"+boardId, boardInput).then((data) => {
            window.modal.simple("보드가 수정되었습니다.");
        });
    }
    updateListRequest(event) {
        const list = event.target.closest('.list');
        const boardId = document.querySelector("#board-id").innerText;
        const listId = list.firstElementChild.innerText;
        const title = list.querySelector('input').value;
        let index;
        document.querySelectorAll('.list').forEach((element, i) => {
            if(element == list) index = i;
        });
        const listInput = { board_id: boardId, title: title, index: index };
        this.makeRequest("PUT", "http://localhost:3000/boards/lists/"+listId, listInput).then((data) => {
            window.modal.simple("리스트가 수정되었습니다.");
        });
    }
    updateCardRequest(event) {
        const card = event.target.closest(".card");
        const list = event.target.closest('.list');
        const boardId = document.querySelector("#board-id").innerText;
        const listId = list.firstElementChild.innerText;
        const cardId = card.querySelector(".card-id").innerText;
        let content = list.querySelector('textarea')?.value;
        let index;
        list.querySelectorAll('.card').forEach((element, i) => {
            if(element == card) index = i;
        });
        const cardInput = { board_id: boardId, list_id: listId, content: content , index: index };
        this.makeRequest("PUT", "http://localhost:3000/boards/lists/cards/"+cardId, cardInput).then((data) => {
            window.modal.simple("카드가 수정되었습니다.");
        });
    }
    moveCardRequest(card) {
        const list = card.closest('.list');
        const boardId = document.querySelector("#board-id").innerText;
        const listId = list.firstElementChild.innerText;
        const cardId = card.querySelector(".card-id").innerText;
        let content = card.innerText;
        let index;
        list.querySelectorAll('.card').forEach((element, i) => {
            if(element == card) index = i;
        });
        console.log(index);
        const cardInput = { board_id: boardId, list_id: listId, content: content , index: index };
        this.makeRequest("PUT", "http://localhost:3000/boards/lists/cards/"+cardId, cardInput).then((data) => {
            
            window.modal.simple(data.message);
        });
    }
    createListRequest(event) {
        const boardId = document.querySelector("#board-id").innerText;
        const title = event.target.closest('.list').querySelector('input').value;
        const index = document.querySelectorAll('.list').length - 1;
        const list = { board_id: boardId, title: title, index: index };
        this.makeRequest("POST", "http://localhost:3000/boards/lists", list).then((data) => {
            window.modal.simple("리스트가 등록되었습니다.");
        });
    }
    createCardRequest(event) {
        const list = event.target.closest('.list');
        const boardId = document.querySelector("#board-id").innerText;
        const listId = list.firstElementChild.innerText;
        const content = list.querySelector('textarea').value;
        const index = list.querySelectorAll('.card').length - 1;
        const card = { board_id: boardId, list_id: listId, content: content , index: index };
        this.makeRequest("POST", "http://localhost:3000/boards/lists/cards", card).then((data) => {
            window.modal.simple("카드가 등록되었습니다.");
        });
    }
    deleteListRequest(event) {
        const boardId = document.querySelector("#board-id").innerText;
        const listId = event.target.closest('.list').firstElementChild.innerText;
        const data = { board_id: boardId };
        this.makeRequest("DELETE", "http://localhost:3000/boards/lists/"+listId, data).then((data) => {
            window.modal.simple("리스트가 삭제되었습니다.");
        });
    }
    deleteCardRequest(event) {
        const boardId = document.querySelector("#board-id").innerText;
        const listId = event.target.closest('.list').firstElementChild.innerText;
        const cardId = event.target.closest(".card").querySelector(".card-id").innerText;
        const data = { board_id: boardId, list_id: listId };
        this.makeRequest("DELETE", "http://localhost:3000/boards/lists/cards/"+cardId, data).then((data) => {
            window.modal.simple("카드가 삭제되었습니다.");
        });
    }

    makeRequest(method, url, data) {    
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

    getDragAfterElement(list, y) {
        const draggableElements = [...list.querySelectorAll('.card:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
            } else {
            return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    Template(board) {
        return `<div id="board-id" style="display: none;">${board.id}</div>
                <div class="board-title pointer">
                    <h3>${board.title}</h3>
                </div>
                <ul class="list-container">
                    ${board.lists.reduce((acc, list) => acc += this.List(list), '')}
                    <li class="list inactive">
                        <div class="text-container pointer add-list">
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
                        <div class="delete-btn hover list-delete">
                            <i class="fas fa-trash-alt "></i>
                        </div>
                        <div class="list-title pointer">
                            <h4>${title}</h4>
                        </div>                
                    </div>
                    <ul class="card-container">
                        ${cards.reduce((acc, card) => acc += this.Card(card), '')}                
                        <li class="card inactive">
                            <div class="text-container pointer add-card">
                                + 카드 등록
                            </div>
                        </li>
                    
                    </ul>
                </li>`;
    }
    
    Card ({id, content}) {
        return `<li class="card active" draggable="true">
                    <div class="card-id" style="display: none;">${id}</div>
                    <div class="delete-btn hover card-delete">
                        <i class="fas fa-trash-alt"></i>
                    </div>
                    <div class="text-container">
                        <div class="card-content pointer">
                            ${content}
                        </div>                
                    </div>
                </li>`;
    }
}