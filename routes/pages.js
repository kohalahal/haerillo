var express = require('express');
var router = express.Router();
const path = require('path');

/* TODO : get 
index
board
login
join
  */

/* GET index */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

/* GET board */
router.get('/board', function(req, res, next) {
  res.sendFile(path.join(__dirname, "../public", "board.html"));
});

/* GET login */
router.get('/login', function(req, res, next) {
  res.sendFile(path.join(__dirname, "../public", "login.html"));
});

/* GET join */
router.get('/join', function(req, res, next) {
  res.sendFile(path.join(__dirname, "../public", "join.html"));
});




module.exports = router;
