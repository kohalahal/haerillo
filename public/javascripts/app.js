(function(){

    function App(){
        this.model = new window.app.Model();
        this.ajax = new window.app.Ajax();
        this.controller = new window.app.Controller(this.ajax, this.model);
        // this.view.render();
    }
    const app = new App();

})();

