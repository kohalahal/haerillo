import abstractview from "./abstractview.js";

export default class extends abstractview {
    constructor(params) {
        super(params);
        this.setTitle("Haerillo 회원 로그인");
    }

    Template() {
        return `<div class="center-container login">
                    <div class="form-container">
                        <div class="form-inform">
                        </div>
                        <form class="login-form">
                            <div class="input-container">
                                <label>username</label>
                                <input type="text" name="username" autocomplete="username">
                            </div>
                            <div class="input-container">
                                <label>password</label>
                                <input type="password" name="password" autocomplete="current-password">
                            </div>                            
                            <a onclick="login();" class="login-btn btn">로그인</a>                            
                        </form>
                        <div class="form-tail">
                            비회원이시라면.. <a href="/join" data-link>Join</a>
                        </div>
                    <!-- end of form-container -->
                    </div>
                <!-- end of center-container -->
                </div>`;
    }
}