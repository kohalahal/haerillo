import Board from "./views/board.js";
import Modal from "./views/modal.js";


export default class {
    constructor(token) {
        this.token = token;
        this.sse = new EventSource("http://localhost:3000/stream/"+token);
        this.init();
        window.board = new Board();
        window.modal = new Modal();
    }

    init = function() {
        this.sse.onopen = function() {
        };

        this.sse.onclose = function() {
        }
    
        this.sse.onerror = function() {
            window.modal.login();
        }
        
        this.sse.onmessage = function(event) {
            const board = new Board();
            document.querySelector(".app").innerHTML = window.board.Template(JSON.parse(event.data));
            window.board.addEvent();
        };
    };

    close = function() {
        this.sse.close();
    }
}