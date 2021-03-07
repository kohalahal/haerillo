import abstractview from "./abstractview.js";

export default class extends abstractview {
    constructor(params) {
        super(params);
        this.setTitle("Haerillo");
    }

    render() {
        document.querySelector(".app").innerHTML = this.Template();
    }

    Template() {
        return `<div class="index-content">
                    <div class="index-message left">
                        보드를 만들어 프로젝트를 관리하세요.
                        팀원을 초대해 협업하세요.
                    </div>
                </div>`;
    }
}