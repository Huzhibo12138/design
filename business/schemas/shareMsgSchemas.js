// 用来定义用户Schemas
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 创建schema

let shareMsgSchema = new Schema({
    // _id:String,
    userId:String,
    time:Date,
    con:String,
    talk:Object,
    good:String,
    imgs:Array,
});
module.exports = shareMsgSchema;