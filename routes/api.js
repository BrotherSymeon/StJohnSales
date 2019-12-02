var express = require('express');
var router = express.Router();


var fileProcessDetailsController = goc.container.get('fileProcessDetailsController');

router.get('/process/:id/details', fileProcessDetailsController.processStatus);



module.exports = router;