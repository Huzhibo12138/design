const path = require('path');
const logger = require('morgan');
const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

// // 连接数据库
const mongoose = require('./business/configs/mongoose');
const db = mongoose();

// 引入路由
const indexRouter = require('./routes/index');
const regeistRouter = require('./routes/regeist');
const loginRouter = require('./routes/login');
const followRouter = require('./routes/follow');
const shareRouter = require('./routes/share');


// 实例化express对象
const app = express();
// 模版引擎
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 静态目录设置
app.use(express.static(path.join(__dirname, 'public')));

// 解析cookie
app.use(cookieParser());
app.use(session({
    secret: 'hbb123456',  //cookie签名
    name:'chetUser',  //cookie名称
    cookie:{maxAge: 3600000},  //过期时间
    store: new FileStore(),  //本地session存储
    resave: false, //每次都重新保存会话(否)
    saveUninitialized: true,  //自动保存未初始化的会话(否)
}));

// 处理主界面请求
app.use('/index',indexRouter);
// 处理注册请求
app.use('/regeist',regeistRouter);
// 处理登录请求
app.use('/login',loginRouter);
// 处理关注请求
app.use('/follow',followRouter);
// 处理动态请求
app.use('/share',shareRouter);



app.all('/favicon', (req,res) => {
    res.send('我们没有没有favicon');
});




// 处理404错误
app.use(function(req, res, next) {
  next(createError(404));
});

// // 错误处理模块
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// const c = require('./routes/createShareMsg');
// app.use('/login',c);

