var express = require('express');
var router = express.Router();


var authController = goc.container.get('authController');
//console.log(authController)

router.get('/login', authController.getLogin);
router.post('/login', authController.passportLoginMiddleware, authController.login);
router.get('/register', authController.getRegister);
router.post('/register', authController.register);
router.get('/logout', authController.logout)



module.exports = router;