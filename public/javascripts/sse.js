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

    init = function() {
        if(!window.board) window.board = new Board();
        if(!window.modal) window.modal = new Modal();

        this.sse.onerror = function() {
            window.modal.tryAgain();
        }
        
        this.sse.onmessage = function(event) {
            window.board.render(JSON.parse(event.data));
        };
    };

    close = function() {
        this.sse.close();
    }

    sleep() {
        this.sse.onmessage = function() {};
        setTimeout(() => {
            this.sse.onmessage = function(event) {
                window.board.render(JSON.parse(event.data));
            };
        }, 1000);
    }
}