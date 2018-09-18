var express = require('express'),
 bodyParser = require('body-parser');
 var AWS = require('aws-sdk'),
   multer = require('multer');
  multerS3 = require('multer-s3');
const request=require('request');

// to save data
const User=require('../Model/usermodel');

const router=express.Router();

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
AWS.config.update({
        accessKeyId: "AKIAID3664MFDJA6M6WQ",
        secretAccessKey:"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",
        region:"ap-south-1"
    });
  var s3 = new AWS.S3();

  var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'quizuser',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    }),
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
// register user 
router.post('/register',function(req,res,next){
	var data=req.body;
	var name=data.name;
	var email=data.email;
	var mobile=data.mobile;
	var pass=data.pass;
	var s_type=data.s_type;
	if(s_type=="g" || s_type=="f" || s_type=="m")
	{
		if(s_type=="g" || s_type=="f")
		{
			var s_id=data.s_id;
			if(s_id=='' || s_id==null)
			{
				res.send({"status":false,"code":404,"message":"Social id is Required"});	
				return false;
			}
		}
		
			
		if(mobile && name)
		{
			// check mobile no is registered as user type
			User.findOne({mobile:mobile,user_type:'u'}).then(function(userdata){
				//console.log(userdata);
				if(userdata)
				{
				   res.send({"status":false,"code":201,"message":"Mobile No is Already Register , Try login","isNewUser":false});	
				}
				else
				{   
				  // new user 
						req.body.pic=req.body.social_pic;
						var tdata= User.findOne().sort({user_id:-1}).select({_id:1,user_id:1}).then(function(tdata){
							  if (tdata) {
							   var countuser=tdata.user_id+1;
							 }else {
							   var countuser=1;
							 }  
							req.body.signup_ver=data.app_ver;
							req.body.role_id=1;
							req.body.account_status='a';
							req.body.user_type='u';
							req.body.user_id=countuser;
							req.body._id=countuser;
							
							User.create(req.body).then(function(newuser){
								  // when user registration done
								  // create user refferal code
								 
								  res.send({"status":true,"code":200,"message":"New User Register","data":newuser,"isNewUser":true});

							  }).catch(next);
						});
				}
			});  
		}
		else
		{
			 res.send({"status":false,"code":404,"message":"Required Parameter missing"});
		}
	}
	else
	{
	   res.send({"status":false,"code":404,"message":"Select proper login type"});	
	}
	
	
});
// loginuser check api 
router.post('/socialcheck',function(req,res,next){   
	var data=req.body;
	var s_id=data.s_id;
	var user_type=data.user_type;
	var s_type=data.s_type;
	if(s_id)
	{
		User.findOne({s_id:s_id,user_type:user_type,s_type:s_type}).then(function(userdata){
			if(userdata)
			{
				var account_stauts=userdata.account_status;
				if(account_stauts=="a")
				{
					
					res.send({"status":true,"code":200,"message":"Social id is Already Register","isNewUser":false,"data":userdata});
				}
				else
				{
					res.send({"status":false,"code":404,"message":"Your account is blocked ,Contact to Support"});
				}
			}
			else
			{
				res.send({"status":true,"code":200,"message":"New Social id","isNewUser":true});
			}
		});
	}
	else
	{
		res.send({"status":false,"code":404,"message":"Social id is required"});
	}
});
// login for user & merchant 
router.post('/login',function(req,res,next){
	var data=req.body;
	var mobile=data.mobile;
	var user_type=data.user_type;
	if(mobile && user_type)
	{
		User.findOne({mobile:mobile,user_type:user_type}).then(function(userdata){
			// console.log(userdata);
			// return false;
			if(userdata)
			{
				var account_status=userdata.account_status;
				var user_id=userdata.user_id;
				var fcm_id=data.fcm_id;
				// updat e 
				var fcm_id=data.fcm_id;
				var current_utc=Math.floor(new Date()/ 1000);
				
				if(account_status=="a")
				{
					if(fcm_id)
					{
						userdata.fcm_id=fcm_id;
					}
					userdata.last_login_utc=current_utc;
					User.updateOne(
                     {user_id:data.user_id},
                      userdata,
                       function(err, result){
                         //  console.log(result);
                        
                       }
                   )
				  res.send({"status":true,"code":200,"message":"Login Success","data":userdata});
				}
				else
				{
					res.send({"status":false,"code":404,"message":"Your account is blocked ,Contact to Support"});
				}
				
			}  
			else
			{
				res.send({"status":true,"code":202,"message":"Mobile No is Not Register,Create Account"});
			}
		});
	}
	else
	{
		res.send({"status":false,"code":404,"message":"Required Parameter is missing"});
	}
});
router.post('/merchantlogin',function(req,res,next){
	var data=req.body;
	var mobile=data.mobile;
	var s_type=data.s_type;
	if(s_type=="g" || s_type=="f" || s_type=="m")
	{
		if(s_type=="g" || s_type=="f")
		{
			var s_id=data.s_id;
			if(s_id=='' || s_id==null)
			{
				res.send({"status":false,"code":404,"message":"Social id is Required"});	
				return false;
			}
		}
		if(mobile && name)
		{
			User.findOne({mobile:mobile,user_type:'m'}).then(function(userdata){
				//console.log(userdata);
				if(userdata)
				{
				   res.send({"status":false,"code":201,"message":"Mobile No is Already Register , Try login","isNewUser":false});	
				}
				else
				{
					// new user 
					var owner_name=data.owner_name;
					var email=data.email;
					var pass=data.pass;
					var city_id=data.city_id;
					var address=data.address;
					
				}
				
			});
		}
	}
	else
	{
	   res.send({"status":false,"code":404,"message":"Select proper login type"});	
	}
});



module.exports=router;
