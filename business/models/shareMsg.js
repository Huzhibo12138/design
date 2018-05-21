// 用来定义model
const mongoose =require('mongoose');
const shareSchema = require('../schemas/shareMsgSchemas');

// 创建model,这个ch_user对应的mongoodb数据库中ch_users的collection
// mogonose会自动更改为复数,如模型xx -> xxes,kitten -> kittens

const shareMsg = mongoose.model('shareMsg',shareSchema);

module.exports = shareMsg;


