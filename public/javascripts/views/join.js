import abstractview from "./abstractview.js";

export default class extends abstractview {
    constructor(params, modal) {
        super(params, modal);
        this.setTitle("Haerillo : 회원 가입");
    }

    Template() {
        return `<div class="center-container border join">
                    <div class="form-container">
                        <form class="join-form">
                            <div class="input-container">
                                <label>username</label>
                                <input type="text" name="username" autocomplete="username">
                            </div>
                            <div class="input-container">
                                <label>email</label>
                                <input type="text" name="email" autocomplete="email">
                            </div>
                            <div class="input-container">
                                <label>password</label>
                                <input type="password" name="password" autocomplete="new-password">
                            </div>
                            <div class="input-container">
                                <label>confirm password</label>
                                <input type="password" name="passwordConfirm" autocomplete="new-password">
                            </div>
                            <div class="join-btn btn pointer" onclick="join();">
                                <a>회원가입</a>                            
                            </div>                            
                        </form>
                        <div class="form-tail">
                            <div class="form-other">
                               회원이시라면.. <a href="/login" data-link>Login</a>
                            </div>   
                        </div>                        
                    <!-- end of form-container -->
                    </div>        
                <!-- end of center-container -->
                </div>`;
    }
}