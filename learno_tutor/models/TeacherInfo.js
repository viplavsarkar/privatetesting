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
  }),
  validate({
    validator: 'isAlphanumeric',
    passIfEmpty: false,
    message: 'Name should contain alpha-numeric characters only'
  })
];

var emailValidator = [
	validate({
	  validator: 'isEmail',
	  passIfEmpty: true,	  
	  message: 'Email format is not correct'
	})
];

var TeacherInfo = new mongoose.Schema({
  wiziqid: { type: Number, default: 0 },
  name: {	type: String },
  about: { type: String },
  approved: { type: Boolean },
  contact_numbers: { mobile_number:{type: String} },
  created_at: { type: Date },
  updated_at: { type: Date, default: Date.now },
  currency: { type: String },
  email_id: { type: String },
  first_name: { type: String },
  gender: { type: String },
  highest_qualification: { type: String },
  home_address:{
        address_line: { type: String },
        city: { type: String },
        country: { type: String },
        is_locset: { type: Boolean },
        location: [Number],
        pin_code:  { type: Number },
        state: { type: String },
        _id: { type: mongoose.Schema.Types.ObjectId }
      },
  last_name: { type: String },
  qualifications:[String],
  rating: { type: Number },
  schedule: mongoose.Schema.Types.Mixed,
  subject_ids:[mongoose.Schema.Types.ObjectId],
  subject_names:[String],
  teaching_class_level: mongoose.Schema.Types.Mixed,
  teaching_languages:[String],
  total_exp: { type: Number },
  tuition_addresses:[{
        state: { type: String },
        _id: mongoose.Schema.Types.ObjectId,
        address_line: { type: String },
        country: { type: String },
        is_locset: { type: Boolean },
        location: [Number],
        pin_code: { type: Number },
      }],
  tuition_fee: { type: Number },
  tuition_location_type:{
      learner_home: { type: String, default: "0" },
      online: { type: String, default: "1" },
      teacher_home: { type: String, default: "1" },
      },
  tuition_type:{
      group: { type: String },
      single: { type: String }
      },
  tutor_image:  { type: String, default: "" },  
  video_image_url: { type: String },
  video_url: { type: String },
  degree: { type: String },
  age_group: { type: String },
  facebook_name: { type: String },
  twitter_name: { type: String }
});

TeacherInfo.pre('save', function(next){
	console.log(" good ");
	next();
});

module.exports = mongoose.model('teacher_info', TeacherInfo);

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