const jwtstratagy=require('passport-jwt').Strategy;
const extractjwt= require('passport-jwt').ExtractJwt;
const user=require('../dbmodels/user');
const config= require('../config/database');

module.exports= function(passport)
{
  "use strict";
  let opts={};
  opts.jwtFromRequest= extractjwt.fromAuthHeader();
  opts.secretOrKey=config.secret;
  passport.use(new jwtstratagy(opts,function(jwtpayload,done){
      user.getUserById(jwtpayload._doc._id, function(err,userr)
    {
      if(err){
        return done(err,false);

      }
      if(user){
        return done(null,userr);
      }
      else{
        return done(null,false);
      }
    });
  }));
}
