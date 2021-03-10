import Board from "./views/board.js";
import Modal from "./views/modal.js";

export default class {
    constructor(token, board, modal) {
        this.token = token;
        this.sse = new EventSource("http://localhost:3000/stream/"+token);
        window.board = board;
        window.modal = modal;
        this.init();
    }

    pause = this.sleep.bind(this);
    onmessage = this.handleData.bind(this);

    init = function() {
        if(!window.board) window.board = new Board();
        if(!window.modal) window.modal = new Modal();

        this.sse.onerror = function() {
            window.modal.tryAgain();
        }
        this.sse.onmessage = this.onmessage;
    };

    close = function() {
        this.sse.close();
    }

    sleep() {
        this.sse.onmessage = function() {};
        setTimeout(() => {
            this.sse.onmessage = this.onmessage;
        }, 1000);
    }

    handleData(event) {
        const data = JSON.parse(event.data);
        switch (data.type) {
            case 'CREATE':
                switch (data.model) {
                    case 'LIST':
                        window.board.addListBySSE(data.listId, data.title);
                        break;
                    case 'CARD':
                        window.board.addCardBySSE(data.listId, data.cardId, data.content, data.index);                    
                        break;
                }                
                break;
            case 'EDIT':
                switch (data.model) {
                    case 'BOARD':
                        window.board.changeBoardTitleBySSE(data.title);
                        break;
                    case 'LIST':
                        window.board.changeListTitleBySSE(data.listId, data.title);
                        break;
                    case 'CARD':
                        if(data.index==undefined) {
                            window.board.changeCardContentBySSE(data.cardId, data.content);
                            break;
                        }
                        window.board.moveCardBySSE(data.listId, data.cardId, data.index);
                        break;
                }                
                break;
            case 'DELETE':
                switch (data.model) {
                    case 'BOARD':
                        window.modal.important(
                            {message: "보드가 삭제되었습니다.", 
                            links: [
                                { title: "보드 목록으로", path: "/board" },
                                { title: "홈으로", path: "/" }
                            ]}
                        );
                        break;
                    case 'LIST':
                        window.board.removeListBySSE(data.listId);
                        break;
                    case 'CARD':
                        window.board.removeCardBySSE(data.cardId);                    
                        break;
                }                
                break;
        }

    }
}