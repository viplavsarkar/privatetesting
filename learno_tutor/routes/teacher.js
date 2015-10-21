var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Teacher = require('../models/Teacher.js');
var TeacherInfo = require('../models/TeacherInfo.js');

var request = require('request');

var wiziqUrl = 'http://wizqe.authordm.com';
//var wiziqUrl = 'http://wiztest.authordm.com';

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
	//http://wiztest.authordm.com/home/mobilesignup?AcademySubdomainName=creamylayer&AcademyEmail=biplabsarka.r7@gmail.com&AcademyName=biplabsarka.r7&AcademyPassword=1234567&AcademyCountryName=india
	//wiziq_login(req, res, next);

	checkEmailBeforeLogin(req, res, next);
});

router.post('/login_fb', function(req, res, next){	
	loginUsingFB(req, res, next);
});

function loginUsingFB(req, res, next){
	console.log("loginUsingFB()");
	facebookAuthentication(req, res, next);	
}

function facebookAuthentication(req, res, next){
	request.get(
	    'https://graph.facebook.com/me?access_token=' + req.body.fb_token,
	    { form: { access_token: req.body.fb_token } },
	    function (error, response, body) {	    	
	    	var bodyObj = JSON.parse(body);
	        if (!error && response.statusCode == 200) {
	        	console.log("facebookAuthentication() - FB Atuthenticated");
	            //res.json(bodyObj);
	            //res.json({ab:"dd"});
	            //facebook login is correct.
	            //now get the user detail from WizIq system
	            var fbId = req.body.fb_id;
	            checkEmailAndLoginForFB(req, res, next, fbId);
	        }else{
	        	if(bodyObj.error) {
	        		//Log it here
	        		return res.json({success: false, statusCode: 400, message: bodyObj.error.message})
	        	}
	        	return res.json({success: false, statusCode: 400, message: "Some error has occured."})
	        }
	    }
	);
}

function checkEmailAndLoginForFB(req, res, next, fbId){
	Teacher.findOne({fbid: fbId}, function(err, tea){
		if(err) return next(err);
		if(tea) return res.json({success:true, teacher: tea, statusCode: 200});	// login(req, res, next);//res.json(tea);//return res.json({success: true, message: "email exists"});
		
		else {

			console.log("NOT FOUND => email: " + req.body.useremail + "; fbId: " + fbId);
			//wiziq_login(req, res, next, fbId)//wiziq_login(req, res, next);
			return res.json({success: false, message: "Could not login using Facebook. Please check your Facebook email address."});
		}
	});	            
}

function checkEmailBeforeLogin(req, res, next){
	console.log("checkEmailBeforeLogin()");
	Teacher.findOne({email: req.body.useremail}, function(err, tea){
		if(err) return next(err);
		if(tea) login(req, res, next);//res.json(tea);//return res.json({success: true, message: "email exists"});
		else wiziq_login(req, res, next, null);
			//return res.json({success: false, message: "User does not exists. Please try signup first"});
	});
}

function checkEmailBeforeSignUp(req, res, next){
	console.log("checkEmailBeforeSignUp()");
	Teacher.findOne({email: req.body.useremail}, function(err, tea){
		if(err) return next(err);
		if(tea) return res.json({success: false, message: "Users exists. Please login instead"});		
		else wiziq_signup(req, res, next);
		//checkEmailAndAddTeacherLocallyForLogin(req, res, next, 0);
			//return res.json({success: false, message: "Cannot signup till evening..."});
	});
}

function wiziq_login(req, res, next, fbId){
	console.log("wiziq_login() - user not found in local");
	
	
	//return res.json(formData);
	console.log('username: ' + req.body.useremail + ' password: ' + req.body.password + ' fbId: ' + fbId);
	request.post(
		wiziqUrl + '/home/mobilelogin',
		{ form: { txtUserName: req.body.useremail, txtPassword: req.body.password } },
		function (error, response, body){
			console.log("wiziq_login() - response obtained from wiziq");
				//return res.json(response);
			if(!error && response.statusCode == 200){
				var bodyObj = JSON.parse(body);
				//console.log('wiziqId=' + bodyObj.wiziqId);
				if(bodyObj.wiziqId == 0){					
					//res.json({success: false, message: "User does not exists. Please try signup first", statusCode: 200});
					console.log("wiziq_login() - Invalid Username or Password");
					return res.json({success: false, message: bodyObj.message, statusCode: 200});
				}else{					
					console.log("wiziq_login() - user exists and wiziqId=" +  bodyObj.wiziqId);
					//res.json(bodyObj);
					console.log("wiziq_login() - creating local copy of wiziqId=" +  bodyObj.wiziqId);

					req.body.useracademyurl = bodyObj.AcademySubdomainName;
					//req.body.useremail; 		
					req.body.firstname 		= bodyObj.FirstName + " " + bodyObj.LastName;
					//req.body.password;
					req.body.usercountry	= bodyObj.AcademyCountryName;
					//checkEmailBeforeSignUp(req, res, next, bodyObj.wiziqId);
					checkEmailAndAddTeacherLocallyForLogin(req, res, next, bodyObj.wiziqId);					
				}				
			}else{
				//some terrible error has occured
				//LOG it here.
				console.log("ERROR: wiziq_login() failed at WizIq End.");
				console.log("Response Body: " + body)
				return res.json({success: false, message: "Login failed."});
			}
		}
	);
}

function wiziq_signup(req, res, next, fbId){
	console.log("wiziq_signup() - user not found in local");
	
	//return res.json(formData);
	//console.log('username: ' + req.body.useremail + ' password: ' + req.body.password + ' fbId: ' + fbId);
	request.post(
		//'http://wiztest.authordm.com/mobilesignup/',
		wiziqUrl + '/mobilesignup/',
		{ 
			form: { 					
					AcademySubdomainName: 	req.body.useracademyurl,	//has to be unique
					AcademyEmail		: 	req.body.useremail, 		//has to be unique
					AcademyName			: 	req.body.firstname,
					AcademyPassword		: 	req.body.password,
					AcademyCountryName	: 	req.body.usercountry					
				}, 
		},
		function (error, response, body){			
			console.log("wiziq_signup() - response obtained from wiziq-body=" + response);
			
			//return res.json(response);
			if(!error && response.statusCode == 200){
				var bodyObj = JSON.parse(body);
				console.log('wiziqId=' + bodyObj.wiziqId);// bodyObj.wiziqId);
				if(bodyObj.wiziqId == -1 ){					
					res.json({success: false, message: bodyObj.errorForMobile, statusCode: 200, errorCode: 450});
				}else if(bodyObj.wiziqId > 0 ) {
					console.log("wiziq_signup() - user created and wiziqId=" +  bodyObj.wiziqId);
					//res.json(bodyObj);
					console.log("wiziq_signup() - creating local copy of wiziqId=" +  bodyObj.wiziqId);
						//mailinator.net
					//temp code ( below 2 lines ) for testing
					//req.body.useracademyurl = "signup testing";							
					//req.body.firstname 		= "signup tempname";
					
					//checkEmailAndAddTeacherLocallyForSignup(req, res, next, bodyObj.wiziqId);
					checkEmailAndAddTeacherLocallyForLogin(req, res, next, bodyObj.wiziqId);
				}else {
					//LOT it here.
					res.json({success: false, statusCode: 200, message: "User could not be created."})
				}
			}else{
				//some terrible error at server has occured has occured
				//LOG it here.
				console.log("ERROR: wiziq_signup() failed at WizIq End.");
				return res.json({success: false, message: "Signup failed."});
			}
		}
	);
}

function checkEmailAndAddTeacherLocallyForLogin(req, res, next, originalWiziqId){
	console.log("checkEmailAndAddTeacherLocallyForLogin()");
	Teacher.findOne({email: req.body.useremail}, function(err, tea){
		if(err) return next(err);
		if(tea) return res.json({success: false, message: "email exists, please login instead"});
		addTeacher(req, res, next, originalWiziqId);
	});
}

function login(req, res, next){
	console.log("login()");
	var postData = {email: req.body.useremail, password: req.body.password};
	Teacher.findOne(postData, function(err, tea){		
		if(err) return next(err);
		if(tea) res.json({success:true, teacher: tea});	
		else return res.json({success: false, message: "Please check your password and try again"});		
	});
}

function addTeacher(req, res, next, originalWiziqId){

	console.log("addTeacher() - adding teacher locally. wiziqid=" + originalWiziqId);
	var aurl 		= 	req.body.useracademyurl;	//has to be unique
	var email 		= 	req.body.useremail; 		//has to be unique
	var firstname	=	req.body.firstname;
	var password	=	req.body.password;
	var country		=	req.body.usercountry;
	var wiziqId     = 	originalWiziqId ? originalWiziqId : 0;
	var fbId 		= 	req.body.fbid ? req.body.fbid : 0;
	//var datenow		= 	Date.now;
	//validate
	//var tea = new Teacher();

	var postData = new Teacher({
						"name"		: 	firstname,
						"email"		:	email,
						"password"	: 	password,	//not to saved
						"academyurl": 	aurl, 
						"country"	: 	country,
						"wiziqid"	: 	wiziqId,
						"fbid" 		: 	fbId
					});
	//return res.json(postData);
	Teacher.create(postData, function(err, post){
		
		console.log("Teacher created");
		if(err) {
			if(err.errors){
				if(err.errors.name && err.errors.name.message){
					return res.json({success: false, message: err.errors.name.message});
				}else if(err.errors.email && err.errors.email.message){
					return res.json({success: false, message: err.errors.email.message});	
				}else if(err.errors.academyurl && err.errors.academyurl.message){
					return res.json({success: false, message: err.errors.academyurl.message});					
				}
			}else{
				return res.json(err.errors);
			}
		}
		checkIfTeacherInfoAlreadyExists(req, res, next, post);
		//createTeacherInfo(req, res, next, post);		
	});
	
}

function checkIfTeacherInfoAlreadyExists(req, res, next, teacher){
	console.log("checkIfTeacherInfoAlreadyExists()");
	TeacherInfo.findOne({email_id: teacher.email}, function(err, teaInfo){		
		if(err) return next(err);
		if(teaInfo) linkTeacherInfoWithTeacher(req, res, next, teacher, teaInfo);// res.json({success:true, teacher: tea});	
		else createTeacherInfo(req, res, next, teacher);
			//return res.json({success: false, message: "Please check your password and try again"});		
	});
}

function linkTeacherInfoWithTeacher(req, res, next, teacher, tchrInfo){
	console.log("TeacherInfo found");	
	console.log("linkTeacherInfoWithTeacher()");
	var dataToUpdate = { 
							wiziqid 	: teacher.wiziqid,
							first_name	: teacher.name,
							teacher_id 	: teacher._id,
							academyurl	: teacher.academyurl
						};
	TeacherInfo.findByIdAndUpdate(tchrInfo._id, dataToUpdate, function(err, post){
		console.log("teacher --> teacherInfo associated");
		if(err) return handleError(req, res, next, err);// return next(err);
		return res.json(teacher);
	});
}

function createTeacherInfo(req, res, next, teacher){
	console.log("TeacherInfo not found");	
	console.log("createTeacherInfo()");	
	var teacherInfoData = new TeacherInfo({
									teacher_id	: teacher._id,
									first_name	: teacher.name,
									email_id	: teacher.email, 
									wiziqid 	: teacher.wiziqid,
									academyurl	: teacher.academyurl,
									created_at: Date.now
								});

	TeacherInfo.create(teacherInfoData, function(err, post){
		console.log("TeacherInfo created");
		if(err) {
			if(err.errors){
				return res.json(err.errors);
			}
			return res.json({success: false, message: 'teacher could not be created'});
		}
		return res.json({success:true, teacher: teacher});
		//return 	updateTeacherInfo(req, res, next);
		//res.json({success:true, teacher: post});		
	});
}

router.put('/:id', function(req, res, next){
	Teacher.findByIdAndUpdate(req.params.id, req.body, function(err, post){
		if(err) return next(err);
		res.json(post);
	});
});

function handleError(req, res, next, err){
	//LOG IT HERE
	return res.json({success: false, message: "Sorry to tell you that some error has occured", statusCode: 505});
}

module.exports = router;
