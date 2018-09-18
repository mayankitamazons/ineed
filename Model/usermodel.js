var mongoose=require('mongoose');
var schema=mongoose.Schema;
var ObjectIdSchema = schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;
// create user default Schema
var UserSchema=new schema({
   _id:{
    type:Number
  },
  user_id:{
  type:Number,Required:true
},
  name:
  {
    type:String
  },
  email:
  {
    type:String,
    match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  // mobile no that will use to redeem
  mobile:
  {
    type:Number,required:true
  },
   pass:
  {
    type:String
  },
  pic:
    {
      type:String
    },
  s_id:
  {
    type:String
  },
  // define login type like gmail , fb, mobile
  s_type:{
    type: String,
    enum: ['f', 'g','m']
  },
  token:
  {
    type:String
  },
  fcm_id:
  {
    type:String
  },
  app_ver:
  {
    type:String
  },
  signup_ver:
  {
    type:String
  },
  last_login_utc:
  {
    type:String
  },
  // define refferal code
  
  // a stand for active , i- inactive , b- user block
  account_status:{
    type: String,
    enum: ['a', 'i','b']
  },
  // 1 for simple user  2 for company 
  role_id:{
    type: Number,
    enum: [1,2]
  },
  // u for normal user , m - merchant account 
  user_type:{
    type: String,
    enum: ['u', 'm']
  },     
  
  time : { type : Date, default: Date.now }
  
});
var User=mongoose.model('user',UserSchema);
module.exports=User;
