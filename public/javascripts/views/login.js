import abstractview from "./abstractview.js";

export default class extends abstractview {
    constructor(params, modal) {
        super(params, modal);
        this.setTitle("Haerillo : 로그인");
    }

    Template() {
        return `<div class="center-container border login">
                    <div class="form-container">
                        <form class="login-form">
                            <div class="input-container">
                                <label>username</label>
                                <input type="text" name="username" autocomplete="username">
                            </div>
                            <div class="input-container">
                                <label>password</label>
                                <input type="password" name="password" autocomplete="current-password">
                            </div>
                            <div class="login-btn btn pointer" onclick="login();">                          
                                <a>로그인</a>                            
                            </div>
                        </form>
                        <div class="form-tail">
                            <div class="form-other">
                                비회원이시라면.. <a href="/join" data-link>Join</a>
                            </div>                         
                            <div class="form-inform">
                            </div>
                        </div>
                    <!-- end of form-container -->
                    </div>                    
                <!-- end of center-container -->
                </div>`;
    }
}