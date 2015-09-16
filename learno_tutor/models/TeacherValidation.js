var teacherValidation = {
var validate = require('mongoose-validator');
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
}