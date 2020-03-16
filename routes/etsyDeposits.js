var express = require('express');

var router = express.Router();
var title = 'St Johns Sales';

var depositController = goc.container.get('depositController');

router.get('/', depositController.index);

router.get('/:id', depositController.byId);

module.exports = router;


