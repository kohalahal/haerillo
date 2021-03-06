export default class {
    constructor(params) {
        this.params = params;
    }
    
    setTitle(title) {
        document.title = title;
    }

    getData() {
        return new Promise();
    }

    render() {
        document.querySelector(".app").innerHTML = this.Template();
    }

    Template(data) {
        return ``;
    }
}