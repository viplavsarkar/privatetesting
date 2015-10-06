var mongoose = require('mongoose');
var validate = require('mongoose-validator');
//var teacherValidation =  require('./TeacherValidation.js');

var academyUrlValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 50],
    message: 'Academy Url should be between {ARGS[0]} and {ARGS[1]} characters'
  }),
  validate({
    validator: 'isAlphanumeric',
    passIfEmpty: false,
    message: 'Academy Url should contain alpha-numeric characters only'
  })
];

var nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 50],
    message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
  })
];

var emailValidator = [
	validate({
	  validator: 'isEmail',
	  passIfEmpty: true,	  
	  message: 'Email format is not correct'
	})
];

var TeacherLogin = new mongoose.Schema({
  wiziqid: { type: Number, default: 0 },
  fbid: { type: Number, default: 0 },
  name: {	type: String,
  			trim: true, 
  			validate: nameValidator
  		},
  email: { 
  			type: String,
  			trim: true,  			
  			validate: emailValidator
  		},
  password: { type: String, required: true },
  academyurl: { type: String, required: true, validate: academyUrlValidator },
  country: { type: String, default: "" },
  status: { type: Number, default: 0},
  updated_at: { type: Date, default: Date.now}
});

TeacherLogin.pre('save', function(next){
	console.log(" good ");
	next();
});

module.exports = mongoose.model('teacher', TeacherLogin);

//teacher profile details
/*
var TeacherProfile = new mongoose.Schema({
  name: { type: String,
        trim: true, 
        validate: nameValidator
      },
  email: { 
        type: String,
        trim: true,       
        validate: emailValidator
      },
  password: { type: String, required: true },
  academyurl: { type: String, required: true, validate: academyUrlValidator },
  country: { type: String, default: "" },
  status: { type: Number, default: 0},
  updated_at: { type: Date, default: Date.now}
});

TeacherProfile.pre('save', function(next){
  console.log(" good ");
  next();
});

module.exports = mongoose.model('teacher_profile', TeacherProfile);
*/