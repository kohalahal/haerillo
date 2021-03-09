import abstractview from "./abstractview.js";

export default class extends abstractview {
    constructor(params, modal) {
        super(params, modal);
    }
    
    alertLogin = this.login.bind(this);
    alertForbidden = this.forbidden.bind(this);
    alertTryAgain = this.tryAgain.bind(this);

    inactivateModal = this.makeDefault.bind(this);

    simple(message) {
        const modal = document.querySelector(".modal");
        modal.classList.add("visible");
        modal.querySelector(".message").innerText = message;
        setTimeout(() => {
            modal.classList.remove("visible");
        }, 1500);
    }

    important(data) {
        const modal = document.querySelector(".modal");
        modal.classList.add("visible");
        modal.classList.add("active");
        modal.querySelector(".message").innerText = data.message;
        data.links.forEach((link) => {
            const btn = document.createElement("a");
            btn.innerText = link.title;
            btn.setAttribute("href", link.path);
            btn.setAttribute("data-link", "");
            btn.addEventListener("click", this.inactivateModal);
            modal.appendChild(btn);
        });
        const btn = document.createElement("a");
        btn.innerText = "닫기";
        btn.addEventListener("click", this.inactivateModal);
        modal.appendChild(btn);
    }

    login() {
        this.important(
            {message: "로그인해주세요.", 
            links: [
                { title: "로그인", path: "/login" }
            ]}
        );
    }

    forbidden() {
        this.important(
            {message: "잘못된 접근입니다.", 
            links: [
                { title: "홈으로", path: "/" }
            ]}
        );
    }

    tryAgain() {
        this.important(
            {message: "다시 시도해주세요.", 
            links: [
                { title: "새로고침", path: window.location.pathname },
                { title: "홈으로", path: "/" }
            ]}
        );
    }

    makeDefault() {
        const modal = document.querySelector(".modal");
        modal.classList.remove("visible");
        modal.classList.remove("active");
        modal.querySelector(".message").innerText = "";
    }
}