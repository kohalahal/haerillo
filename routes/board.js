var express = require('express');
var router = express.Router();

/* GET board page. */
router.get('/board', function(req, res, next) {
  res.render('board', { title: 'Haerillo' });
});

module.exports = router;
