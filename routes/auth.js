const express = require('express');
const router = express.Router();

const crypto = require('crypto');
const {execSync} = require('child_process');

var authController = goc.container.get('authController');
//console.log(authController)

router.get('/login', authController.getLogin);
router.post('/login', authController.passportLoginMiddleware, authController.login);
router.get('/register', authController.getRegister);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

router.post('/git', (req, res) => {
  console.log('git was called');
  //console.log('git request body', req.body);
  const branch = req.body.ref.split('/')[req.body.ref.split('/').length - 1];
  console.log('branch is ', branch);
  const hmac = crypto.createHmac('sha1', process.env.SECRET);
  nst sig = 'sha1=' + hmac.update(JSON.stringify(req.body)).digest('hex');
  ole.log('git request headers ', req.headers);
  req.headers['x-github-event'] === 'push' &&
    ypto.timingSafeEqual(Buffer.from(sig), Buffer.from(req.headers['x-hub-signature']))) {
  s.sendStatus(200);
  nst commands = ['git fetch origin master',
    'git reset --hard origin/master',
    'git pull origin master --force',
    //'npm install',
    // your build commands here
    'refresh']; // fixes glitch ui
  for (const cmd of commands) {
    console.log(execSync(cmd).toString());
  }
  console.log('updated with origin/master!');
    return;
  } else {
    console.log('webhook signature incorrect!');
    return res.sendStatus(403);
  }
});


module.exports = router;
