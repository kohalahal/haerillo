import Board from "./views/board.js";

export default class {
    constructor(token) {
        this.token = token;
        this.sse = new EventSource("http://localhost:3000/stream/"+token);
        this.init();
    }

    init = function() {
        this.sse.onopen = function() {
            console.log("SSE Connection to server opened.");
        };

        this.sse.onclose = function() {
            console.log("SSE CLOSE");
        }
    
        this.sse.onerror = function() {
            console.log('SSE error');
        }
        
        this.sse.onmessage = function(event) {
            console.log('new sse!');
            // console.log(event.data);    
            console.log(JSON.parse(event.data));          
            document.querySelector(".app").innerHTML = new Board().Template(JSON.parse(event.data));
        };
    };

    close = function() {
        this.sse.close();
    }
}