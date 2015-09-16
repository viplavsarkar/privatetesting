var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });  
});

router.get('/sign_in', function(req, res){
	//res.send("hello world");
	res.render('signin', { title: 'Hello' });
});
module.exports = router;

router.post('/adduser', function(req, res){
	var db = req.db;
	//console.log("Got response: " + res.statusCode);

	var content = '';
	/*
	req.on('data', function (data) {
	  // Append data.
	  content += data;
	});

	req.on('end', function () {
		// Assuming, we're receiving JSON, parse the string into a JSON object to return.
		var data = JSON.parse(content);
		//res.render('index', { txtName: data.txtName });
		console.log("Request Body0 = " + data);  
	});
	*/
	console.log("Request Body = " + JSON.stringify(req.body));  
	
	var userAcademyUrl = req.body.useracademyurl

	//TODO: Validation
	
	var aurl 		= 	req.body.useracademyurl;
	var email 		= 	req.body.useremail;
	var firstname	=	req.body.firstname;
	var password	=	req.body.password;
	var country		=	req.body.usercountry;
	var ID = "";
	//Set out collection
	var collection = db.get('teachers');
	collection.insert(
							{
								"username"	: 	firstname,
								"email"		:	email,
								"password"	: 	password,	//not to saved
								"academyurl": 	aurl, 
								"country"	: 	country
							}, 
							function(err, doc){
								if(err){
									//If it failed, return error
									res.send({"success" : false});
								}else{
									//And forward to success page
									//res.redirect("userList");
									//res.send("CREATED: useracademyurl = " + userAcademyUrl);
									//res.send("doc = " + JSON.parse(doc));
									ID = doc._id;
									console.log("_id1 = " + doc._id);
									console.log("_id2 = " + doc.ID);
									console.log("Doc = " + JSON.stringify(doc));  

									res.send({"success": true, userid: doc._id});
									//res.send("useracademyurl = " + userAcademyUrl + " _id = " + ID);
								}
							}
						);

	//res.send("useracademyurl = " + userAcademyUrl + " _id = " + ID);
});