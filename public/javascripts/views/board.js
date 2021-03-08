import abstractview from "./abstractview.js";
import SSE from "../sse.js"


export default class extends abstractview {
    constructor(params, modal) {
        super(params, modal);
        this.sse;

        this.boardTitleValue = "";
        this.listTitleValue = "";
        this.cardContentValue = "";
        
        this.activeListEditor = null;
        this.activeListInput = null;
        this.activeCardEdior = null;
        this.activeCardInput = null;

        this.listIdBeforeCardDrag = null;
        this.indexBeforeCardDrag = null;        
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
    
    deleteList = this.deleteListRequest.bind(this);
    deleteCard = this.deleteCardRequest.bind(this);
    
    memorizeCard = this.memorizeCardDrag.bind(this);
    compareCard = this.compareCardDrag.bind(this);
    moveCard = this.moveCardRequest.bind(this);

    bindEventListener = this.addEvent.bind(this);

    async init() {
        try {
            const data = await this.getData(this.params.id);
            if(data) {
                this.render(data.board);
                if(!this.sse) this.sse = new SSE(data.streamToken, this, this.modal);
                return;
            } else {
                this.modal.forbidden();
                return;
            }
        } catch(err) {
            console.log(err);
        }
        this.modal.forbidden();
        return;
    }

    render(board) {
        document.querySelector("body").classList.add("color");
        document.querySelector(".app").innerHTML = this.Template(board);
        this.setTitle("Haerillo : " + board.title);
        this.bindEventListener();
    }

    getData(id) {
        return new Promise(function (resolve, reject) {
            if(!window.localStorage.getItem("token")) {
                this.modal.login();
                return reject();
            }
            const xhr = new XMLHttpRequest();
            const url = "http://localhost:3000/boards/"+id;
            xhr.open('GET', url);
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
            xhr.responseType = 'json';
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });                }
            };
            xhr.onerror = function () {  
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });            };
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
                this.memorizeCard(card);
            });
            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
                this.compareCard(card);
            });
        });
        document.querySelectorAll('.card-container').forEach(list => {
            list.addEventListener('dragover', e => {
                e.preventDefault();
                const afterElement = this.getDragAfterElement(list, e.clientY);
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
        this.boardTitleValue = text;
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
        this.listTitleValue = text;
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
        board.classList.add("shadow");
        board.classList.add("border");
        const title = document.createElement("h3");
        title.classList.add("pointer");
        title.innerText = this.boardTitleValue;
        board.innerText = "";
        board.appendChild(title);
        board.addEventListener("click", this.editBoardEventAction);
    }
    removeListEditor(event) {
        if(event) event.stopPropagation();
        const list = this.activeListEdior.closest(".list-title");
        list.classList.add("shadow");
        list.classList.add("border");
        const title = document.createElement("h4");
        title.innerText = this.listTitleValue;
        list.innerHTML = "";
        list.appendChild(title);
        list.addEventListener("click", this.editListEventAction);
        list.closest(".text-container").querySelector(".delete-btn").classList.add("hover");
        this.activeListEdior = null;
        this.listTitleValue = "";
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
        this.cardContent = "";
    }
    makeListInput(event) {
        console.log(this.params.id);

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
        const boardId = this.params.id;
        const title = document.querySelector(".board-title").querySelector('input').value;
        const boardInput = { title: title };
        this.makeRequest("PUT", "http://localhost:3000/boards/"+boardId, boardInput).then((data) => {
            this.modal.simple("보드가 수정되었습니다.");
        });
    }
    updateListRequest(event) {
        const boardId = this.params.id;
        const list = event.target.closest('.list');
        const listId = list.firstElementChild.innerText;
        const title = list.querySelector('input').value;
        const listInput = { board_id: boardId, title: title };
        this.makeRequest("PUT", "http://localhost:3000/boards/lists/"+listId, listInput).then((data) => {
            this.modal.simple("리스트가 수정되었습니다.");
        });
    }
    updateCardRequest(event) {
        const boardId = this.params.id;
        const card = event.target.closest(".card");
        const list = event.target.closest('.list');
        const listId = list.firstElementChild.innerText;
        const cardId = card.querySelector(".card-id").innerText;
        const content = list.querySelector('textarea').value;
        const cardInput = { board_id: boardId, list_id: listId, content: content };
        this.makeRequest("PUT", "http://localhost:3000/boards/lists/cards/"+cardId, cardInput).then((data) => {
            this.modal.simple("카드가 수정되었습니다.");
        });
    }
    memorizeCardDrag(card) {
        const list = card.closest(".list");
        this.listIdBeforeCardDrag = list.firstElementChild.innerText;
        list.querySelectorAll('.card').forEach((element, i) => {
            if(element == card) {
                this.indexBeforeCardDrag = i;
                return;
            }
        });
    }
    compareCardDrag(card) {
        const list = card.closest(".list");
        const listId = list.firstElementChild.innerText;
        let index;
        list.querySelectorAll('.card').forEach((element, i) => {
            if(element == card) {
                index = i;
                return;
            }
        });
        if(this.listIdBeforeCardDrag == listId && this.indexBeforeCardDrag == index) return;
        this.sse.pause();
        if(this.cardBeforeDragListId != listId) {
            const cardsInListNow = Array.from(list.querySelectorAll(".card.active"));
            const cardsMovingBackward = cardsInListNow.filter((i) => 
                i >= index
            );
            if(cardsMovingBackward.length>0) cardsMovingBackward.forEach((card, i) => {                
                this.moveCardRequest(i==0?listId:null, card.firstElementChild.innerText, index + i );
            });
            const listBefore = document.querySelector(".list.id-"+this.listIdBeforeCardDrag);
            const cardsInListBefore = Array.from(listBefore.querySelectorAll(".card.active"));
            const cardsMovingForward = cardsInListBefore.filter((i) => 
                i > this.indexBeforeCardDrag
            );
            if(cardsMovingForward.length>0) cardsMovingForward.forEach((card, i) => {
                this.moveCardRequest(null, card.firstElementChild.innerText, this.indexBeforeCardDrag + i );
            });
            return;
        } 
        const bigger = index < this.indexBeforeCardDrag? this.indexBeforeCardDrag : index;
        const smaller = index < this.indexBeforeCardDrag? index : this.indexBeforeCardDrag;
        const cardsInList = Array.from(list.querySelectorAll(".card.active"));
        const cardsMoving = cardsInList.filter((i) => 
            i <= bigger && i >= smaller 
        );
        if(cardsMoving.length>0) cardsMoving.forEach((card, i) => {
            this.moveCardRequest(null, card.firstElementChild.innerText, smaller + i);
        });   
    }
    moveCardRequest(listId, cardId, index) {
        const boardId = this.params.id;
        const cardInput = { board_id: boardId };
        if(listId) cardInput.list_id = listId;
        cardInput.index = index;
        this.makeRequest("PUT", "http://localhost:3000/boards/lists/cards/"+cardId, cardInput).then((data) => {
        });
    }
    createListRequest(event) {
        this.activeListInput = null;
        const boardId = this.params.id;
        const title = event.target.closest('.list').querySelector('input').value;
        const index = document.querySelectorAll('.list').length - 1;
        const list = { board_id: boardId, title: title, index: index };
        this.makeRequest("POST", "http://localhost:3000/boards/lists", list).then((data) => {
            this.modal.simple("리스트가 등록되었습니다.");
        });
    }
    createCardRequest(event) {
        this.activeCardInput = null;
        const boardId = this.params.id;
        const list = event.target.closest('.list');
        const listId = list.firstElementChild.innerText;
        const content = list.querySelector('textarea').value;
        const index = list.querySelectorAll('.card').length - 1;
        const card = { board_id: boardId, list_id: listId, content: content , index: index };
        this.makeRequest("POST", "http://localhost:3000/boards/lists/cards", card).then((data) => {
            this.modal.simple("카드가 등록되었습니다.");
        });
    }
    deleteListRequest(event) {
        if(!confirm("리스트를 정말로 삭제하시겠습니까?")) return;
        const boardId = this.params.id;
        const listId = event.target.closest('.list').firstElementChild.innerText;
        const data = { board_id: boardId };
        this.makeRequest("DELETE", "http://localhost:3000/boards/lists/"+listId, data).then((data) => {
            this.modal.simple("리스트가 삭제되었습니다.");
        });
    }
    deleteCardRequest(event) {
        const boardId = this.params.id;
        const list = event.target.closest('.list');
        const listId = list.firstElementChild.innerText;
        const card = event.target.closest(".card.active");
        const cardId = card.querySelector(".card-id").innerText;
        const cardsInList = list.querySelectorAll('.card');
        let index;
        cardsInList.forEach((element, i) => {
            if(element == card) {
                index = i;
                return;
            }
        });
        if(index+1 < cardsInList.length) {
            const array = Array.from(cardsInList);
            array.filter((i) => 
                i > index
            ).forEach((card, i) => {
                this.moveCardRequest(null, card.firstElementChild.innerText, index + i );
            });
        }
        const data = { board_id: boardId, list_id: listId };
        this.makeRequest("DELETE", "http://localhost:3000/boards/lists/cards/"+cardId, data).then((data) => {
            this.modal.simple("카드가 삭제되었습니다.");
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
                <div class="board-title shadow">
                    <h3 class="pointer">${board.title}</h3>
                </div>
                <ul class="list-container">
                    ${board.lists.reduce((acc, list) => acc += this.List(list), '')}
                    <li class="list inactive shadow">
                        <div class="text-container pointer add-list">
                            + 리스트 등록
                        </div>                    
                    </li>
                <!-- end of list-container -->
                </ul>`;        
    }
    
    List ({id, title, cards}) {
        return `<li class="list id-${id} shadow border" draggable="true">
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
                        <li class="card inactive shadow">
                            <div class="text-container pointer add-card shadow">
                                + 카드 등록
                            </div>
                        </li>
                    
                    </ul>
                </li>`;
    }
    
    Card ({id, content, index}) {
        return `<li class="card active shadow border" draggable="true">
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