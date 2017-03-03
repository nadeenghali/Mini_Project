const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const jwt= require('jsonwebtoken');

const Users= mongoose.Schema({
  fullname:{ type: String, required:true},
  username:{ type: String, required:true, unique:true},
  password:{ type: String, required:true},
  email:   { type: String, required:true},
  usertype:{ type: String,required:true},
  portfolio:[]

});

const User= module.exports= mongoose.model('User', Users);

module.exports.getUserById= function(id, callback)
{
  User.findById(id,callback);
}

module.exports.getUserByUsername= function(username, callback)
{
  const qry={username: username}
  User.findOne(qry,callback);
}

module.exports.addUser = function(user, callback)
{
  bcrypt.genSalt(10, function(err,salt)
{
  bcrypt.hash(user.password, salt, function(err, hash)
  {
      if(err){
      console.log(err);

      }
      else{
        user.password=hash;
        user.save(callback);
      }


  })
});
}
module.exports.comparePassword= function(pass,hash, callback){
  bcrypt.compare(pass,hash,function(err,valid)
{
  if(err)
  {
    console.log(err);
  }
  callback(null,valid);
});
}
