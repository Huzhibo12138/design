// 用来连接mongoDB的数据库并引用定义Schema和Model
const mongoose = require('mongoose');
const config = require('../configs/config');

function app() {
    mongoose.connect(config.mongodb);
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, '连接错误'));
    db.once('open', () => console.log('主服务器连接数据库连接成功!!!<^_^>') );
    return db;
}

function chat() {
    mongoose.connect(config.mongodb);
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, '连接错误'));
    db.once('open', () => console.log('聊天服务器连接数据库连接成功!!!<^_^>') );
    return db;
}

module.exports = {
    app:app,
    chat:chat,
}
