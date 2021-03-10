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

## REST api
- 회원 api   
/auth/join : 회원가입  
/auth/login : 로그인, jwt 발행  
/auth/verify : jwt 인증  

- 보드 api  
/boards  
/boards/lists  
/boards/lists/cards  
각 uri마다 GET, POST, PUT, DELETE 메소드 제공  

- 스트림 api  
스트림 토큰으로 권한 인증  
http 스트림 response를 통해 보드 변경 사항 실시간 전달  

## SSE
- 서버는 변경 사항 발생 시 보드 전체의 정보를 전달하지 않고, 변경된 요소의 정보만을 부분적으로 전달한다.
- 이를 전송받은 클라이언트는 페이지 전체를 새로고침하지 않고 변경된 요소만을 갱신한다.
- 이러한 부분적 갱신은 전체 페이지 갱신보다 주고 받는 데이터가 적어 효율적이고, 유저가 작업중인 부분도 보존할 수 있다.  

## FRONT
- vanilla JavaScript만을 이용한 Single Page Application  
- Ajax를 통하여 api 서버와 통신  
- Server Sent Event를 통하여 변경 사항을 실시간으로 갱신  

## MODEL
* 유저, 보드, 리스트, 카드 4개의 엔티티
- 유저 : 보드 => M:M 관계(협업 기능 추가를 위해서)
- 보드 : 리스트 => 1:N 관계
- 리스트 : 카드 => 1:N 관계

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





