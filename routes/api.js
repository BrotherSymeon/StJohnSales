var express = require('express');
var router = express.Router();


var fileProcessController = goc.container.get('fileProcessController');

router.get('/process/:id/details', fileProcessController.processStatus);



module.exports = router;