const express=require('express');
const mongoose=require('mongoose');
var request = require('request');
// body parser is use to process input to node
var bodyParser = require('body-parser');
var multer = require('multer');

var upload = multer({dest:'uploads/'});
var morgan = require('morgan')
// set up express app

var app = express();
app.use(morgan('combined'))
//var site_url="http://localhost:4001/uploads/topic/";
// connect to mongodb database
// live server
mongoose.connect('mongodb://52.66.71.176:27017/ineeddb');
//mongoose.connect('mongodb://localhost:27017/quizking');
mongoose.Promise=global.Promise;
// use body parse  before request type
// for parsing application/json
app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/v1/users',require('./routes/users'));

app.get('/',function(req,res){
res.sendFile(__dirname + "/index.html");
});
// error handling midlehandling
app.use(function(err,req,res,next){
 //console.log(err);
  // res.status(422).send({error:err.message})
   res.status(422).send({"status":false,"code":404,"message":err.message});
});

// listen for request
app.listen(4000,function(){
 console.log('Listing to Request');
});
app.timeout = 120000;
