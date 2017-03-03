const express = require('express');
const router = express.Router();
const Users= require('../dbmodels/user');
const Projects= require('../dbmodels/project');
const passport= require('passport');
const jwt= require('jsonwebtoken');
const config=require('../config/database');



router.get('/', function(req, res, next){
  res.render('index.ejs');
});

router.get('/register', function(req, res, next) {
  res.render('register.ejs');
});

// Register
router.post('/register', function(req, res, next) {
  //"use strict";
  console.log(req.body);
  console.log(req.body.fullname, req.body.username, req.body.password, req.body.email, req.body.usertype);
  var newuser= new Users({fullname: req.body.fullname, username: req.body.username,
                    password: req.body.password, email: req.body.email, usertype: req.body.usertype});

                    Users.addUser(newuser, function(err, user){
                      if(err)
                      {
                        console.log(err)
                        res.json({success:false, msg:'Failed to register'});

                      }
                      else {

                        //  res.json({success:true, msg:'Successful'});
                      //  res.send(500,'showSignUpAlert') ;
                      res.render('index.ejs');
                      }
                    });
});



// Authenticate
router.post('/authenticate',function(req, res, next){
  const username=req.body.username;
  const password=req.body.password;
  Users.getUserByUsername(username, function(err,user)
  {
  //  if(err) throw err;
    if(!user)
    {
      return res.json({success:false,msg:'Not a user'});
    }
    Users.comparePassword(password, user.password, function(err,valid)
  {
    if(err)
    {
      return res.send(err);

    }
    if(valid)
    {
      const token=jwt.sign(user,config.secret,{
          expiresIn:200000
      });
      if(user.usertype==="1")//student
      {
      // res.json({sucess:true, token:'JWT'+token,
      //user:{id:user._id, name:user.fullname, username:user.username, email:user.email}});
//  console.log(user);
Users.find({}).exec(function (err, users) {
  if(err)
  {
    console.log(err);
  }
  else{
        res.render("userhomepage.ejs",{user,users:users});
  }

});

      }
    else{//not student
  //      console.log(user);
  Users.find({}).exec(function (err, users) {
    if(err)
    {
      console.log(err);
    }
    else{
          res.render("otherhomepage.ejs",{user,users:users});
    }

  });
    }
    }
    else{
      return res.json({success:false, msg:'wrong password'});
    }
  });
  });

});


//User home page
router.get('/userhomepage/:param',function(req, res, next) {
  //res.json({user: req.user});
  //res.redirect("/userhomepage.html");
  const username=req.params.param;
  console.log(username);
  Users.getUserByUsername(username, function(err,user)
  {
  console.log(user);
  Users.find({}).exec(function (err, users) {
    if(err)
    {
      console.log(err);
    }
    else{
          res.render("userhomepage.ejs",{user,users:users});
    }

  });
});
});

// Profile
router.get('/profile/:param',function(req, res, next) {

  //const user1=req.user;
  //console.log(user);
  //res.render("profile",{user:user1});
//  res.json({user: req.user});
const username=req.params.param;
console.log(username);
Users.getUserByUsername(username, function(err,user)
{
console.log(user);
res.render("profile.ejs",{user});
});

});

router.get('/otherhomepage/:param',function(req, res, next) {
  //res.json({user: req.user});
  //res.redirect("/userhomepage.html");
  const username=req.params.param;
  console.log(username);
  Users.getUserByUsername(username, function(err,user)
  {
  console.log(user);
  Users.find({}).exec(function (err, users) {
    if(err)
    {
      console.log(err);
    }
    else{
          res.render("otherhomepage.ejs",{user,users:users});
    }

  });

});
});
//Guest View
router.get('/guestview',function(req, res, next)
{
  Users.find({}).exec(function (err, users) {
    if(err)
    {
      console.log(err);
    }
    else{
        res.render("guestview.ejs",{users:users});
    }

  })

});


router.get('/projectadd/:param',function(req, res, next) {
  //res.json({user: req.user});
  //res.redirect("/userhomepage.html");
  const username=req.params.param;
  console.log(username);
  Users.getUserByUsername(username, function(err,user)
  {
  console.log(user);
  res.render("projectadd.ejs",{user});
});
});

router.post('/addWork/:param',function(req, res, next)
{
  const username=req.params.param;
  console.log(username);
  const project=req.body.project;
  var newproject= new Projects({username: req.body.username,title: req.body.title, url: req.body.url,
                  repo:req.body.repo});

  Users.getUserByUsername(username, function(err,user)
  {
  console.log(user);
  var p=user.portfolio;
  p.push(newproject);
  user.update({username:username},{$set: {portfolio:p}})
  user.save(function(er,user)
  {
    if(err)
    {
      res.render("userhomepage.ejs",{user});
    }
    else{
      res.render("profile.ejs",{project, user});
    }
  });
});
});




module.exports = router;
