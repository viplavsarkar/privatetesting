var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Subject = require('../models/Subject.js');


var request = require('request');

/* GET users listing. */
router.get('/all', function(req, res, next) {
	getAll(req, res, next);
  //res.send('respond with a resource');
});

router.get('/:id', function(req, res, next) {
	getOneSubject(req, res, next);
  //res.send('respond with a resource');
});

function getOneSubject(req, res, next){
	console.log('getOneSubject()');
	Subject.findOne(req.params.id, function(err, subject){
 		if (err) return next(err);
		res.json(subject);
	});
}

function getAll(req, res, next){
	console.log('getAll()');
	Subject.find(function (err, todos) {
	    if (err) return next(err);
		res.json(todos);
  	});
}

module.exports = router;
