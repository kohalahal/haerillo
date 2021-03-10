
# HAERILLO

## 프로젝트 관리 웹 서비스

🦜 #SPA 🦢 #PURE JAVASCRIPT 🦩 #SSE 🕊 #VANILLA JAVASCRIPT 🐇 #DRAG AND DROP 🦝 #AJAX 🍀 #SEQUELIZE 🌷 #PASSPORT 🌼 #JWT 🍃 #PROJECT MANAGEMENT 🍁 #ORM 💐 #CSS


## DEMO
🌞 [TRY DEMO HERE](https://haerillo.herokuapp.com/)

## FEATURE
- 드래그 앤 드롭 기능
![스크린샷](/haerillo.gif?raw=true)
- SSE 실시간 클라언트 동기화
![스크린샷](/sync.gif?raw=true)


## TECH STACK
- Node.js v14.16.0  
- Express 4.17.1  
- Passport 0.4.1  
- Sequelize 6.5.0  
- MySQL 8.0.21  
- JavaScript ES6  

## ARCHITECTURE
- 하나의 프로젝트를 **REST api** 서버와 **vanilla JavaScript SPA** 프론트(public 폴더)로 분리하여 구성  
~~~
//app.js
//REST api
app.use('/auth', authRouter);
app.use('/stream', streamRouter);
app.use('/boards', passport.authenticate('jwt', {session: false}), boardRouter);

//FRONT
app.use('/static', express.static('public'));
app.get('/*', function(req, res, next) {
    res.sendFile(path.join(__dirname, "./public", "index.html"));
});
~~~

## MODEL
* 유저, 보드, 리스트, 카드 4개의 엔티티
- 유저 : 보드 => M:M 관계(협업 기능 추가를 위해서)
- 보드 : 리스트 => 1:N 관계
- 리스트 : 카드 => 1:N 관계

## REST api
- 회원 api   
/auth/join : 회원가입  
/auth/login : 로그인, jwt 발행  
/auth/verify : jwt 인증  

- 보드 api  
각 uri 별로 GET, POST, PUT, DELETE 메소드 제공  
/boards  
/boards/lists  
/boards/lists/cards  

- 스트림 api  
스트림 토큰으로 보드에 대한 권한을 확인 
http 스트림 response를 통해 보드 변경 사항 실시간 전달  
/stream

## STREAM TOKEN
바닐라 자바스크립트에서 SSE 객체를 생성할 시에는 header에 인증 정보를 보낼 수 없다.
하지만 인증 절차 없이 보드 정보를 스트리밍 받을 수 있도록 할 수는 없다.
그래서 /boards/:boardId를 통해서 보드에 대한 get 요청을 성공 하였을 시 stream token을 발급하여 stream SSE 객체를 생성하도록 하였다. 
~~~
    //서버(/routes/boards.js)
    const streamToken = jwtUtility.generateStreamToken(req.params.boardId);
    res.set('Cache-Control', 'no-store');
    res.status(http.StatusCodes.OK).json({ streamToken, board, message: '보드와 스트림 토큰 전송.' });
~~~
~~~
    //클라이언트(/view/board.js)
    const data = await this.getData(this.params.id);
          if(data) {
              this.render(data.board);
              if(!this.sse) this.sse = new SSE(data.streamToken, this, this.modal);
              return;
          } else {
              this.modal.forbidden();
              return;
          }
~~~
stream token은 유효기간이 10초로 설정되어있고, Array에 담아 서버에 보관한다.
클라이언트가 stream token으로 인증을 거치고 나면 서버 Array에서 삭제한다. 이를 통해서 하나의 토큰은 한 번의 인증만 가능하도록 하였다.

## SSE
- 서버는 변경 사항 발생 시 보드 전체의 정보를 전달하지 않고, 변경된 요소의 정보만을 부분적으로 전달한다.
- 이를 전송받은 클라이언트는 페이지 전체를 새로고침하지 않고 변경된 요소만을 갱신한다.
- 이러한 부분적 갱신은 전체 페이지 갱신보다 주고 받는 데이터가 적어 효율적이고, 유저가 작업중인 부분도 보존할 수 있다.  

## FRONT
- vanilla JavaScript만을 이용한 Single Page Application  
- Ajax를 통하여 api 서버와 통신  
- Server Sent Event를 통하여 변경 사항을 실시간으로 갱신  


## INSTALLATION
- DB 설정   
mysql 설치 후 DB 정보를 /config/config.json 파일에 입력  
- HAERILLO 설치  
```shell
git clone https://github.com/kohalahal/haerillo

cd haerillo

npm install

npm start
```
- http://localhost:3000 으로 접속 가능  





