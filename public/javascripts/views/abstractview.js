export default class {
    constructor(params, modal) {
        this.params = params;
        this.modal = modal;
    }
    
    setTitle(title) {
        document.title = title;
    }

    async init() {
        this.render(this.getData());
    }

    getData() {
    }

    render(data) {
        document.querySelector(".app").innerHTML = this.Template(data);
    }

    Template(data) {
        return ``;
    }
}