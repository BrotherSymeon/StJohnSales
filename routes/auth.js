var express = require('express');
var router = express.Router();


var authController = goc.container.get('authController');

router.get('/login', authController.getlogin);
router.post('/login', authController.login);
router.get('/signup', authController.getSignup);
router.post('/signup', authController.signup);



module.exports = router;