(function () {

    window.Templates = { Board, List, Card }

    function Board ({id, title, lists}) {
        return `<div id="board-id" style="display: none;">${id}</div>
                <div class="board-title">
                    <h3>${title}</h3>
                </div>
                <ul class="list-container">
                    ${lists.reduce((acc, list) => acc += List(list), '')}
                    <li class="list inactive">
                        <div class="text-container text add-list">
                            + 리스트 등록
                        </div>                    
                    </li>
                <!-- end of list-container -->
                </ul>`;
    }
    
    function List ({id, title, cards}) {
        return `<li class="list">
                    <div class="text-container">
                        <div class="delete-btn">
                            <a class="list-delete-${id}"><i class="fas fa-trash-alt "></i></a>
                        </div>
                        <div class="list-title text">
                            <h4>${title}</h4>
                        </div>                
                    </div>
                    <ul class="card-container">
                        ${cards.reduce((acc, card) => acc += Card(card), '')}
                    
                        <li class="card">
                            <div class="text-container">
                            <textarea class="list-input"></textarea>
                            <div class="ok-btn-container">
                                <a class="ok-btn">OK</a>
                            </div>
                            </div>
                        </li>
                    
                    </ul>
                </li>`;
    }
    
    function Card ({id, content}) {
        return `<li class="card active">
                    <div class="delete-btn">
                        <a class="card-delete ${id}"><i class="fas fa-trash-alt"></i><a>
                    </div>
                    <div class="text-container">
                        <div class="card-content text">
                            ${content}
                        </div>                
                    </div>
                </li>`;
    }

})();