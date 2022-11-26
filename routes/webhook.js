var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
    res.send('respond with a resource');
    console.log('[BOT已準備就緒]');
});

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
    console.log('[BOT已準備就緒]');
});

module.exports = router;
