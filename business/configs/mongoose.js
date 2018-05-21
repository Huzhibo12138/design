// 用来连接mongoDB的数据库并引用定义Schema和Model
const mongoose = require('mongoose');
const config = require('../configs/config');

module.exports = function () {
    mongoose.connect(config.mongodb);
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, '连接错误'));
    db.once('open', () => console.log('数据库连接成功!!!<^_^>') );
    return db;
}
