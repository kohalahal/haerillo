var express = require('express');
var router = express.Router();
const path = require('path');

/* GET board page. */
router.get('/board', function(req, res, next) {
  res.sendFile(path.join(__dirname, "../public", "board.html"));
});

module.exports = router;
