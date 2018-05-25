const http = require('http');
const express = require('express');
const socket = require('socket.io');
const logger = require('morgan');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

// 实例化express对象
const app = express();
app.set('port',8080);
const server = http.createServer(app);
server.listen(8080);
const io = socket(server);

server.once('listening',() => {
	console.log('服务器启动成功');
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 静态目录设置
app.use(express.static(__dirname));


// 解析cookie
app.use(cookieParser());

app.use(session({
    secret: 'hzb',  //cookie签名
    name:'user',  //cookie名称
    cookie:{maxAge: 1000 * 60 * 60},  //过期时间
    store: new FileStore(),  //本地session存储
    resave: false, //每次都重新保存会话(否)
    saveUninitialized: true,  //自动保存未初始化的会话(否)
}));


