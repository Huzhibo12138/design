// 用来定义model
const mongoose =require('mongoose');
const verifySchema = require('../schemas/varifySchemas');

// 实例化对象
const verify = mongoose.model('verify',verifySchema);

// 挂载出口
module.exports = verify;