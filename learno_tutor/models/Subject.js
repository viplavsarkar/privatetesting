var mongoose = require('mongoose');
//var validate = require('mongoose-validator');
//var teacherValidation =  require('./TeacherValidation.js');


var Subject = new mongoose.Schema({  
  tutor_ids: [mongoose.Schema.Types.ObjectId], 
  name: {	type: String }, 
  is_popular: { type: Boolean},
  image_path: { type: String},
  created_at: { type: Date },
  updated_at: { type: Date, default: Date.now }
});

Subject.pre('save', function(next){
	console.log("saving subject ");
	next();
});

//module.exports = mongoose.model('teacher_info', TeacherInfo);
module.exports = mongoose.model('subjects', Subject);
