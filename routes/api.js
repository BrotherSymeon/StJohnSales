var express = require('express');
var router = express.Router();
var salesController = require('../controllers/salesController');
var fileProcessController = require('../controllers/fileProcessController');

var tours = [
  {id:1, name:'Hood River Tour', price: 789.00},
  {id:2, name:'Nile Tour', price: 789.00},
  {id:3, name:'Shocoe Bottom Tour', price: 789.00},
  {id:4, name:'James River Tour', price: 789.00},

]

// get all the tours in json format
router.get('/tours', function(req, res){
  res.json(tours);
});

// update a tour
router.put('/api/tour/:id', function(req, res){
  var p = tours.some(function(p){ return p.id === req.params.id; });
  if(p){
    if(req.query.name) p.name = req.query.name;
    if(req.query.price) p.price = req.query.price;
    res.json({success: true});
  } else {
    res.json({error: 'No such tour exists'});
  }
});

//delete a tour
router.delete('/api/tour/:id', function(req, res) {
  var found = tours.findIndex(function(tour){ return tour.id === req.params.id; });
  if(found >= 0){
    tours.splice(found, 1);
    res.json({ success: true });
  } else {
    res.json({ error: 'no such tour'});
  }
});

router.get('/process/:id/details', fileProcessController.process_status);



module.exports = router;