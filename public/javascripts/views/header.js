import abstractview from "./abstractview.js";

export default class extends abstractview {
    constructor(params) {
        super(params);
    }

    async render() {
        try {
            const data = await this.getData();
            if(data) {
                document.querySelector("nav.nav").innerHTML = this.Template("회원님");
            } else {
                document.querySelector("nav.nav").innerHTML = this.Template();
            }
        } catch(err) {
            document.querySelector("nav.nav").innerHTML = this.Template();
        }
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
                    return resolve(this.status);
                } else {                    
                    window.localStorage.removeItem("token");
                    return reject();
                }                
            };
            xhr.onerror = function () {  
                return reject();
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
                        ${data}, 어서오세요
                    </li>
                    <li>
                        <a href="/board" data-link>보드</a>
                    </li>
                    <li>
                        <a onclick="logout()">로그아웃</a>
                    </li>
                </ul>`;
    }
}