var express = require('express');
var router = express.Router();
var smsController = require('../controllers/smsController');

router.get('/smslist', smsController.smslist);
module.exports = router;
