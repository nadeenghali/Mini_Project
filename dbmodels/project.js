const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const Users= require('../dbmodels/user');

const Projects= mongoose.Schema({
  //id:{       type: String, required:true, unique:true},
  title:{type:String,required:true, unique:true },
  url:{type:String},
  repo:{type:String},
//  screenshot:{data: Buffer, contentType: String}

});

const Project= module.exports= mongoose.model('Project', Projects);

// module.exports.addProject = function(project, callback)
// {
//
//         const user=Users.getUserByUsername(project.username);
//         user.portfolio.push(project);
//         user.save(callback);
//
//
// };
