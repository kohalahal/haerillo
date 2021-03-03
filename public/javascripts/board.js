/* TODO(브라우저 입장)

1.보드 정보를 겟한다.
오류나면 알린다

2.보드 정보를  html 로 뿌린다.



*/


(function() {
    //쿼리에서 보드 아이디 가져오기
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    //숫자인지 체크
    if(isNaN(id)) {
        //잘못된 접근

    }
    const url = '/boards/id';
    const getBoard = function(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
            const status = xhr.status;
          if (status === 200) {
            callback(null, xhr.response);
          } else {
            callback(status, xhr.response);
          }
        };
        xhr.send();
    };
    let board;
    const boardJson = getBoard(url, (err, data) => {
        if(err) {
            alert('Something went wrong: ' + err);

        } else {
            board = JSON.parse(data);
            console.log(board);
        }

    });



})();
