import abstractview from "./abstractview.js";

export default class extends abstractview {
    constructor(params, modal) {
        super(params, modal);
        this.setTitle("Welcome to Haerillo");
    }

    Template() {
        return `<div class="index-content">
                    <div class="index-message">
                        <div class="index-message text">
                            <p class="logo">
                                WELCOME<br>TO<br>HAERILLO!
                            </p>
                        </div>
                        <div class="index-message image">
                                <h2>
                                    보드를 만들고 프로젝트를 관리하세요.
                                </h2>
                                <img src="https://cdn.pixabay.com/photo/2017/02/04/15/25/desk-2037545_960_720.png">
                        </div>
                    </div>     
                </div>`;
    }
}