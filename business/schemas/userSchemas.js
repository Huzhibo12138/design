// 用来定义用户Schemas
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 创建schema
let userSchema = new Schema({
    _id: String,
    name: String,
    identity:Number,
    iddescription:String,
    password: String,
    newUser:Boolean,
    sex:String,
    birthday:String,
    follow:Array,
    headPic:String,
});
module.exports = userSchema;