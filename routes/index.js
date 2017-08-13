var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bata Dynamic Model' });
});

router.get('/trees', function(req, res, next) {
  res.render('trees', { title: 'Bata Dynamic Tree' });
});

module.exports = router;
