var mongoose = require('mongoose');
var validate = require('mongoose-validator');
//var teacherValidation =  require('./TeacherValidation.js');

var academyUrlValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 50],
    message: 'Academy Url should be between {ARGS[0]} and {ARGS[1]} characters'
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

var TeacherInfo = new mongoose.Schema({
  teacher_id: mongoose.Schema.Types.ObjectId,
  wiziqid: { type: Number, default: 0 },
  name: {	type: String },
  academyurl: { type: String },
  about: { type: String },
  approved: { type: Boolean, default: false },
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
  schedule: { type: mongoose.Schema.Types.Mixed, default: {} },
  subject_ids:[mongoose.Schema.Types.ObjectId],
  subject_names:[String],
  teaching_class_level: mongoose.Schema.Types.Mixed,
  teaching_languages:[String],
  total_exp: { type: Number, default: 0 },
  tuition_addresses:[{
        state: { type: String },
        _id: mongoose.Schema.Types.ObjectId,
        address_line: { type: String },
        country: { type: String },
        is_locset: { type: Boolean },
        location: [Number],
        pin_code: { type: Number },
        city: { type: String }
      }],
  tuition_fee: { type: Number, default: 0 },
  price_per_hour: { type: String, default: ""},
  tuition_location_type:{
      learner_home: { type: String, default: "0" },
      online: { type: String, default: "1" },
      teacher_home: { type: String, default: "1" },
      },
  tuition_type:{
      group: { type: String, default: "0" },
      single: { type: String, default: "1" }
      },
  tutor_image:  { type: String, default: "" },  
  video_image_url: { type: String },
  video_url: { type: String },
  degree: { type: String },
  age_group: { type: String },
  facebook_name: { type: String },
  twitter_name: { type: String },
  quickblox_id: { type: String },
  _keywords: [String]
});

TeacherInfo.pre('save', function(next){
	console.log(" good ");
	next();
});

//module.exports = mongoose.model('teacher_info', TeacherInfo);
module.exports = mongoose.model('tutors', TeacherInfo);
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