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
  console.log('git request body', req.body);
  console.log('git request body.hook.config ', req.body.hook.config);
  const hmac = crypto.createHmac('sha1', process.env.SECRET);
  const sig = 'sha1=' + hmac.update(JSON.stringify(req.body)).digest('hex');
  console.log('git request headers ', req.headers);
  if (req.headers['x-github-event'] === 'push' &&
    crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(req.headers['x-hub-signature']))) {
    res.sendStatus(200);
    const commands = ['git fetch origin master',
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
