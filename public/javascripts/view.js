import Header from "./views/header.js";
import Index from "./views/index.js";
import Join from "./views/join.js";
import Login from "./views/login.js";
import Boards from "./views/boards.js";
import Board from "./views/board.js";


const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);
    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const header = new Header();
    header.render();

    const routes = [
        { path: "/spa", view: Index },
        { path: "/join", view: Join },
        { path: "/login", view: Login },
        { path: "/board", view: Boards },
        { path: "/board/:id", view: Board }
    ];
    const potentialMatches = routes.map(route => {
        console.log("pathto:"+ location.pathname.match(pathToRegex(route.path)));
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });
    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);
    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }
    const view = new match.route.view(getParams(match));
    view.render();
};


window.addEventListener("popstate", router);
document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });
    router();
});
