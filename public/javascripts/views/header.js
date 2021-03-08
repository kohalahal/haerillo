import abstractview from "./abstractview.js";

export default class extends abstractview {
    constructor(params, modal) {
        super(params, modal);
    }

    async init() {
        try {
            const data = await this.getData();
            if(data) {
                this.render("회원님");
                return;
            } 
        } catch(err) {

        }
        this.render();
    }

    render(data) {
        document.querySelector("nav.nav").innerHTML = this.Template(data);
    }

    getData() {
        return new Promise(function (resolve, reject) {
            if(!window.localStorage.getItem("token")) {
                return reject();
            }
            const xhr = new XMLHttpRequest();
            const url = "http://localhost:3000/auth/verify"            
            xhr.open('GET', url);
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    return resolve(xhr.response);
                } else {     
                    window.localStorage.removeItem("token");
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
    }

    Template(data) {
        if(!data) {
            return `<ul>
                        <li>
                            <a href="/join" data-link>회원가입</a>
                        </li>
                        <li>
                            <a href="/login" data-link>로그인</a>
                        </li>
                    </ul>`;
        }
        return ` <ul>
                    <li>
                        ${data}, 어서오세요!
                    </li>
                    <li>
                        <a href="/board" data-link>보드</a>
                    </li>
                    <li>
                        <a class="pointer" onclick="logout()">로그아웃</a>
                    </li>
                </ul>`;
    }
}