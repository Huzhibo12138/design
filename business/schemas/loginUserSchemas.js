// 用来定义用户Schemas
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 创建schema
let loginUserSchema = new Schema({
    _id: String,
    name: String,
    identity:Number,
    newUser:Boolean,
    follow:Array,
});
module.exports = loginUserSchema;