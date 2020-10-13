const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bodyparser=require('body-parser');
const bcrypt=require('bcryptjs');
const app = express();

app.use("/static", express.static('static'));

mongoose.connect('mongodb://localhost:27017/Users', { useNewUrlParser: true ,useUnifiedTopology: true } );

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("Successfully connected to database");
});

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const contactInfo = mongoose.model('userschemas', contactSchema);
app.use(express.urlencoded());

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function (req, res) {
  res.render("index");
});
app.get('/index.html', function (req, res) {
  res.render("index");
});
app.post('/index.html', function (req, res) {
  console.log("post");
  var data = req.body;
  contactInfo.find({name:data.username},(err,data1)=>{
    bcrypt.hash(data.password,10).then(hash1=>{
      if(hash1==data1[0].password)
      {
        res.send("Successfully Logged in");
      }
      else{
        console.log(hash1,data1[0].password);
        res.send("Invalid Credentials");              $2a$10$WQXdGhDDna0kZleEI7EiouXSNmvho0qy1C.Fx7MERMfnP.jOZ5JYG
      }
    })
  })
});
app.post('/', function (req, res) {
  console.log("post");
  var data = req.body;
  contactInfo.find({name:data.username},(err,data1)=>{
    bcrypt.hash(data.password,10).then(hashed=>{
      if(hashed==data1[0].password)
      {
        res.send("Successfully Logged in");
      }
      else{
        console.log(hashed,data1[0].password);
        res.send("Invalid Credentials");
      }
    })
  })
});
app.get('/signup.html', function (req, res) {
  res.render("signup");
});

app.post('/signup.html', (req, res) => {
  var arr=req.body;
  bcrypt.hash(arr.password,10).then(hash1=>{
    var myData = new contactInfo({name:arr.name,email:arr.email,password:hash1});
    myData.save().then(console.log("Saved"));
    res.send("Data saved");
  })
});
 
app.listen(80, () => { console.log("App2 started at port 80.") });