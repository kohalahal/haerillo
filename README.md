# HAERILLO

## 프로젝트를 목록으로 관리하자

### 🌞 [TRY DEMO HERE](https://haerillo.herokuapp.com/)

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
하나의 프로젝트를 **REST api** 서버와 **vanilla JavaScript SPA** 프론트(public 폴더)로 분리하여 구성

## REST api
- 회원 api 
auth/join : 회원가입
auth/login : 로그인, jwt 발행
auth/verify : jwt 인증

- 보드 api
boards
boards/lists
boards/lists/cards
각 uri마다 GET, POST, PUT, DELETE 메소드 제공

- 스트림 api
스트림 토큰으로 권한 인증, 스트림 response를 통해 보드 변경 사항 실시간 제공

## FRONT
- vanilla JavaScript만을 이용한 Single Page Application  
- Ajax를 통해 api 서버와 통신  
- Server Sent Event를 통해 변경 사항 전달받아 실시간 갱신  

## SSE
- 서버에서 Board, List, Card 각각의 변경 사항을 부분적으로 전달하고, 이를 전송받은 클라이언트는 페이지 전체가 아닌 부분만을 갱신한다.  
- 전체를 갱신하는 것보다 주고 받는 데이터가 적어 효율적이고, 유저의 작업에도 지장을 적게 준다.  

## MODEL
- 유저:보드 M:M 관계(협업 기능 추가를 위해서)
- 보드:리스트 1:N 관계
- 리스트:카드 1:N 관계

## INSTALLATION
- 설치 전에..  
mysql 설치, config/config.json 파일에 db 정보 입력  
- HAERILLO 설치  
```shell
git clone https://github.com/kohalahal/haerillo

cd haerillo

npm install

npm start
```
- http://localahost:3000 으로 접속 가능  





