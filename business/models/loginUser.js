// 用来定义model
const mongoose =require('mongoose');
const loginUserSchema = require('../schemas/loginUserSchemas');


const loginUser = mongoose.model('loginUser',loginUserSchema);

module.exports = loginUser;