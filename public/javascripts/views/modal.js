import abstractview from "./abstractview.js";

export default class extends abstractview {
    constructor(params) {
        super(params);
    }

    simple(message) {
        const modal = document.querySelector("#message");
        modal.innerText = message;
        modal.classList.add("visible");
        setTimeout(() => {
            modal.classList.remove("visible");
        }, 1500);
    }

    important(data) {
        const modal = document.querySelector("#message");
        modal.innerText = data.message;
        modal.classList.add("visible");
        const btn = document.createElement("a");
        btn.innerText = data.title;
        btn.setAttribute("href", data.link);
        modal.appendChild(btn);
    }

    login() {
        this.important({message: "로그인 해주세요.", title:"로그인", link: "/login"});
    }

    forbidden() {
        this.important({message: "접근 권한이 없습니다.", title:"홈으로", link: "/"})
    }

    Template() {
        return ``;
    }
}