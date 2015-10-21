var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var request = require('request');

//teacher infor to be shifted to a new controller
var TeacherInfo = require('../models/TeacherInfo.js');

var wiziqUrl = 'http://wizqe.authordm.com';
//var wiziqUrl = 'http://wiztest.authordm.com';
/*
router.get('/testing/:subjectId', function(req, res, next){
	//res.json({result: 'hello'});
	var Subject = require('../models/Subject.js');

	
	var sub = new Subject();
	Subject.getAll(req, res, next);

	Subject.find({tutor_ids: } function (err, todos) {
	    if (err) return next(err);
		res.json(todos);
  	});
  	
});
*/

router.get('/all', function(req, res, next){
	/*
	var numerator = 5;
	var denominator	= 0;
	var ratio = numerator / denominator;
	res.json({val: ratio});
	*/
	TeacherInfo.find({},function(err, tea){
		if(err) res.send(err);
		else return res.json(tea);
	});
});

router.get('/:id', function(req, res, next){	
	getTeacherInfo(req, res, next);
});

router.put('/:id', function(req, res, next){
	//modify the request params for search fields
	console.log(req.body);
	if(req.body.tuition_addresses){
		console.log("address change requested");
		var addr = req.body.tuition_addresses[0];
		var addrLine = addr.address_line ? addr.address_line : "";
		var addrCity = addr.city ? addr.city : "";
		var addrState= addr.state ? addr.state : "";

		var str 	= addrLine + " " + addrCity + " " + addrState;
	    console.log("LOCATION FOR ==>" + str);

	    
		var geocoder = require('geocoder');
		// Geocoding
		//geocoder.selectProvider("google",{"apiKey":"AIzaSyBHbIGTi9gK38Qu4mkXV_FhpXHzE4q8ck4"});
		geocoder.geocode(str, function ( err, data ) {
			console.log("address location found");
			//console.log(data);
			//return res.json(data);
			if(data) if(data.results[0]) if(data.results[0].geometry){
				var dataObj = data.results[0].geometry.location;// JSON.parse(data);
				lat = dataObj.lat;
				lng = dataObj.lng;
				console.log("location=[" + lat + ", " + lng + "]");
				req.body.tuition_addresses[0].location = [lat, lng];
				req.body.tuition_addresses[0].is_locset = true;		  		
			}

			return createOrUpdateTeacherInfo(req, res, next);
		});
		
		//return createOrUpdateTeacherInfo(req, res, next);
	} else {
		//console.log("address change not requested");
		return createOrUpdateTeacherInfo(req, res, next);
	}
	/*
	TeacherInfo.findById(req.params.id, function(err, teaInfo){
		if(err) res.send(err);
		if(teaInfo) return updateTeacherInfo(req, res, next);
		return createTeacherInfo(req, res, next);

	});
*/
	
});

router.get('/loc/:str', function(req, res, next){
	getLatLong(req, res, next, req.params.str);
});

function createOrUpdateTeacherInfo(req, res, next){
	console.log("createOrUpdateTeacherInfo");
	TeacherInfo.findOne({teacher_id: req.params.id}, function(err, teaInfo){
			if(err) res.send(err);
			if(teaInfo) return updateTeacherInfo(req, res, next, teaInfo);
			return createTeacherInfo(req, res, next);
		});
}

function getLatLong(req, res, next, str){
	var lng = 0;
	var lat = 0;
	//getLocFromGoogle(str);
	var geocoder = require('geocoder');
		// Geocoding
	//geocoder.selectProvider("google",{"apiKey":"AIzaSyBHbIGTi9gK38Qu4mkXV_FhpXHzE4q8ck4"});
	geocoder.geocode(str, function ( err, data ) {
		  // do something with data
		  //console.log(data);
		  if(data) if(data.results[0]) if(data.results[0].geometry) if(data.results[0].geometry.location){
			  var dataObj = data.results[0].geometry.location;// JSON.parse(data);
			  lat = dataObj.lat;
			  lng = 3;// dataObj.lng;
			}
		  return res.json({address: dataObj, latlong:[lat,lng]})
	});

	//res.json({address: str, latlong:[lat,lng]})
}

function getLocFromGoogle(str){
	var geocoderProvider = 'google';
	var httpAdapter = 'https';
	// optionnal 
	//https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyBHbIGTi9gK38Qu4mkXV_FhpXHzE4q8ck4
	var extra = {
	    apiKey: 'AIzaSyBHbIGTi9gK38Qu4mkXV_FhpXHzE4q8ck4', // for Mapquest, OpenCage, Google Premier 
	    formatter: null         // 'gpx', 'string', ... 
	};
	var nodeGeocoder = require('node-geocoder'); 
	var geocoder = new nodeGeocoder(geocoderProvider, httpAdapter, extra);

	//var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);
	 
	 /*
	// Using callback 
	geocoder.geocode(str, function(err, res) {
	    console.log(res);
	});
	*/
}

function getTeacherInfoFromWizIq(req, res, next, teacher){
	console.log('getTeacherInfoFromWizIq() for wiziqid=' + teacher.wiziqid);
	request.get(
		//'http://wiztest.authordm.com/profiles/get/' + teacher.wiziqid,
		wiziqUrl + '/profiles/get/' + teacher.wiziqid,
		{},
		function (error, response, body){
			if(!error && response.statusCode == 200){
				try{
					//console.log("body=>" + body);
					var bodyObj = JSON.parse(body);
					console.log("RESPONSE ==> " + body);
					/*
					if(bodyObj.FirstName)	teacher.first_name = bodyObj.FirstName;					
					if(bodyObj.LastName)	teacher.last_name = bodyObj.LastName;
					if(bodyObj.Email)	teacher.email_id = bodyObj.Email;
					if(bodyObj.Gender)	teacher.gender = bodyObj.Gender;					
					if(bodyObj.AboutMe)	teacher.about = bodyObj.AboutMe;					
					*/
					/*
					if(bodyObj.Address)	teacher.home_address.address_line = bodyObj.Address;
					if(bodyObj.State)	teacher.home_address.state = bodyObj.State;					
					if(bodyObj.City)	teacher.home_address.city = bodyObj.City;					
					if(bodyObj.Country) teacher.home_address.country = bodyObj.Country;
					if(bodyObj.PIN) 	teacher.home_address.pin_code = bodyObj.PIN;
					*/
					//if(bodyObj.Subjects)teacher.subject_names = bodyObj.Subjects;
					if(bodyObj.ProfileImageName)	teacher.tutor_image = bodyObj.ProfileImageName;
					/*
					if(bodyObj.Social){
						if(bodyObj.Social.Twitter)	teacher.twitter_name = bodyObj.Social.Twitter;
					}
					*/
				}catch(e){
					console.log("\nERROR = " + e);
				}
					return res.json(teacher);
				}else{
					//some terrible error has occured
					//LOG it here.
					console.log("ERROR: getTeacherInfoFromWizIq() failed at WizIq End.");
					console.log("Response Body: " + body)
					return res.json({success: false, message: "Userdata from wiziq failed."});
			}

			res.json(response);
		});
}

function getTeacherInfo(req, res, next){
	console.log('getTeacherInfo()');
	TeacherInfo.findOne({teacher_id: req.params.id}, function(err, tea){
	//TeacherInfo.findById(req.params.id, function(err, tea){
		if(err) return next(err);
		if(tea) return getTeacherInfoFromWizIq(req, res, next, tea);//return res.json(tea);// createTeacherInfo(req, res, next); //res.json(tea);//return res.json({success: true, message: "email exists"});
		else return res.json({success: false, message: "User detail is not available"});
		//else return createTeacherInfo(req, res, next);;//
	});
}

function updateTeacherInfo(req, res, next, teaInfo){
	console.log('updateTeacherInfo()');
	var searchStr = "";
	if(req.body.first_name){
		searchStr = req.body.first_name.trim();
	}else{
		if(teaInfo) if(teaInfo.first_name) {
			searchStr = teaInfo.first_name.trim();
		}
	}
	//console.log(req.body);
	var subIdArrFinal = [];
	if(req.body.subject_ids){
		var subIdArr = req.body.subject_ids;
		for(var i = 0; i < subIdArr.length; i++){
			if(subIdArr[0]) if(subIdArr[0].trim() != "") subIdArrFinal.push(subIdArr[i]);
		}
	}
	req.body.subject_ids = subIdArrFinal;

	if(req.body.subject_names){
		searchStr = searchStr + "," + req.body.subject_names.toString().trim();
	}else{
		searchStr = searchStr + "," + teaInfo.subject_names.toString().trim();
	}
	searchStr = searchStr.toLowerCase();
	console.log("new searchStr=" + searchStr);
	req.body._keywords = searchStr.split(',');
	console.log('updating user details for _id=' + teaInfo._id);
	TeacherInfo.findByIdAndUpdate(teaInfo._id, req.body, function(err, post){
		console.log('teacher updated');
		console.log(err);
		if(err) return handleError(req, res, next, err);
		console.log("TeacherInfo updated:" + JSON.stringify(req.body));
		updateTeacherWithNameAndEmail(post.teacher_id, post.first_name, post.email_id);
		return res.json(post);
	});
}

function createTeacherInfo(req, res, next){
	console.log("createTeacherInfo() for _id=" + req.params.id);
	var postData = new TeacherInfo({
									//_id: req.params.id,
									teacher_id: req.params.id,
									created_at: Date.now
								});

	TeacherInfo.create(postData, function(err, post){
		if(err) {
			if(err.errors){
				return res.json(err.errors);
			}
			return res.json({success:false});
		}
		else if(post) return updateTeacherInfo(req, res, next, post);
		else return res.json({success:false});
		//res.json({success:true, teacher: post});		
	});

}
//teacher  info controller ends

function updateTeacherWithNameAndEmail(id, first_name, email_id){
	//this is a temporary arrangement
	//remove this method once done with testing
	console.log("updateTeacherWithNameAndEmail() for id=" + id);
	var Teacher = require('../models/Teacher.js');
	var postData = {name: first_name, email: email_id};
	Teacher.findByIdAndUpdate(id, postData, function(err, post){
		if(err) return next(err);
		console.log("Teacher updated with name=" + first_name + " ; email=" + email_id);
		//return res.json(post);
	});
}

function handleError(req, res, next, err){
	//LOG IT HERE
	return res.json({success: false, message: "Sorry to tell you that some error has occured", statusCode: 505});
}
module.exports = router;
