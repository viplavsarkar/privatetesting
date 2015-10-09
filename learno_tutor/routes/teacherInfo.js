var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');


//teacher infor to be shifted to a new controller
var TeacherInfo = require('../models/TeacherInfo.js');

router.get('/:id', function(req, res, next){
	getTeacherInfo(req, res, next);
});

router.put('/:id', function(req, res, next){	
	TeacherInfo.findOne({teacher_id: req.params.id}, function(err, teaInfo){
		if(err) res.send(err);
		if(teaInfo) return updateTeacherInfo(req, res, next, teaInfo);
		return createTeacherInfo(req, res, next);
	});
	/*
	TeacherInfo.findById(req.params.id, function(err, teaInfo){
		if(err) res.send(err);
		if(teaInfo) return updateTeacherInfo(req, res, next);
		return createTeacherInfo(req, res, next);

	});
*/
	
});

function getTeacherInfo(req, res, next){
	TeacherInfo.findOne({teacher_id: req.params.id}, function(err, tea){
	//TeacherInfo.findById(req.params.id, function(err, tea){
		if(err) return next(err);
		if(tea) return res.json(tea);// createTeacherInfo(req, res, next); //res.json(tea);//return res.json({success: true, message: "email exists"});
		res.json({success: false, message: "User detail is not available"});
		//else return createTeacherInfo(req, res, next);;//
	});
}

function updateTeacherInfo(req, res, next, teaInfo){
		
	TeacherInfo.findByIdAndUpdate(teaInfo._id, req.body, function(err, post){
		if(err) return next(err);
		console.log("TeacherInfo updated:" + JSON.stringify(req.body));
		return res.json(post);
	});
}

function createTeacherInfo(req, res, next){
	var postData = new TeacherInfo({
									_id: req.params.id,
									created_at: Date.now
								});

	TeacherInfo.create(postData, function(err, post){
		if(err) {
			if(err.errors){
				res.json(err.errors);
			}
		}	
		return 	updateTeacherInfo(req, res, next, post);
		//res.json({success:true, teacher: post});		
	});

}
//teacher  info controller ends




module.exports = router;
