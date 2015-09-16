var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Teacher = require('../models/Teacher.js');

/* GET users listing. */
router.get('/all', function(req, res, next) {
	Teacher.find(function (err, todos) {
	    if (err) return next(err);
		res.json(todos);
  	});
  //res.send('respond with a resource');
});

router.post('/signup', function(req, res, next){
	checkEmailBeforeSignUp(req, res, next);
});

router.post('/login', function(req, res, next){
	checkEmailBeforeLogin(req, res, next);
});

function checkEmailBeforeSignUp(req, res, next){
	Teacher.findOne({email: req.body.useremail}, function(err, tea){
		if(err) return next(err);
		if(tea) return res.json({success: false, message: "email exists, please login instead"});
		addTeacher(req, res, next);
	});
}

function checkEmailBeforeLogin(req, res, next){
	Teacher.findOne({email: req.body.useremail}, function(err, tea){
		if(err) return next(err);
		if(tea) login(req, res, next);//res.json(tea);//return res.json({success: true, message: "email exists"});
		else return res.json({success: false, message: "User does not exists. Please try signup first"});
	});
}

function login(req, res, next){
	var postData = {email: req.body.useremail, password: req.body.password};
	Teacher.findOne(postData, function(err, tea){
		if(err) return next(err);
		if(tea) res.json(tea);	
		else return res.json({success: false, message: "Please check your password and try again"});		
	});
}

function addTeacher(req, res, next){
	var aurl 		= 	req.body.useracademyurl;	//has to be unique
	var email 		= 	req.body.useremail; 		//has to be unique
	var firstname	=	req.body.firstname;
	var password	=	req.body.password;
	var country		=	req.body.usercountry;
	//var datenow		= 	Date.now;
	//validate
	//var tea = new Teacher();

	var postData = new Teacher({
						"name"		: 	firstname,
						"email"		:	email,
						"password"	: 	password,	//not to saved
						"academyurl": 	aurl, 
						"country"	: 	country
					});
	//res.json(postData);
	/*
	postData.save(function(err, post){
		if(err) res.json(err); //return next(err);
		res.json(post);
	});
	*/
	Teacher.create(postData, function(err, post){
		if(err) {
			if(err.errors){
				if(err.errors.name && err.errors.name.message){
					res.json({success: false, message: err.errors.name.message});
				}else if(err.errors.email && err.errors.email.message){
					res.json({success: false, message: err.errors.email.message});	
				}else if(err.errors.academyurl && err.errors.academyurl.message){
					res.json({success: false, message: err.errors.academyurl.message});					
				}
			}else{
				res.json(err.errors);
			}
		}	
		post.success = true;
		res.json(post);
	});
	
}

router.put('/:id', function(req, res, next){
	Teacher.findByIdAndUpdate(req.params.id, req.body, function(err, post){
		if(err) return next(err);
		res.json(post);
	});
});

module.exports = router;
