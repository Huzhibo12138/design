// 用来定义用户Schemas
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 创建schema
let verifySchema = new Schema({
    _id: String,
    code:String,
    createAt:Date,
    reqTime:Number
});

// 挂载出口
module.exports = verifySchema;