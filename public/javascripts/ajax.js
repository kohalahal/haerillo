(function () {

    window.app = window.app || {};
    window.app.Ajax = Ajax;

    function Ajax() {
        // this.init();
    }

    

    Ajax.prototype.init = async function() {
        this.boardId = this.getBoardId();
        this.board = await this.getBoard(this.boardId);
        console.log(this.board);
    }
    
    
    Ajax.prototype.getBoardId = function() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('id');
        return id;
    }
    
    Ajax.prototype.getBoard = function(boardId) {
        // return await this.sendGetRequest('http://localhost:3000/boards/'+boardId);
        return new Promise(function (resolve, reject) {
            let url = 'http://localhost:3000/boards/'+boardId;
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
            xhr.responseType = 'json';
            xhr.send();
            xhr.onreadystatechange = function () {
                if (this.status >= 200 && this.status < 300) {
                    console.log(xhr.response);
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
        });
    };
    

    Ajax.prototype.sendGetRequest = (url) => {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
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
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send();
        });
        // const xhr = new XMLHttpRequest();
        // xhr.open('GET', url, true);
        // 
        // xhr.onload = function() {
        //     const status = xhr.status;
        //   if (status === 200) {
        //     console.log(xhr.response);
        //     return xhr.response;
        //   } else {
        //     alert('Something went wrong: ' + status);
        //   }
        // };
        // xhr.send();
    }


 
})();

