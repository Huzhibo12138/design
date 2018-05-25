const express = require('express');
const router = express.Router();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const sessionStore = new MongoStore({
    url: 'mongodb://localhost/user'
});

const User = require('../business/models/user');
const LoginUser = require('../business/models/loginUser');

function checkMsg(req,res,next) {
    // 格式化请求信息
    let userMsg = {
        _id:req.body._id,
        password:req.body.password
    }
    User.findOne(userMsg,(err,data) =>{
        if(err || !data) {
            res.json({code:1,err:'登录信息有误,请检查'});
        }else{
            req.userData = data;
            next();
        }
    });
}

function wirteDb(req,res,next) {
    let userMsg = {
        _id: req.userData._id,
        name: req.userData.name,
        identity:req.userData.identity,
        newUser:req.userData.newUser,
        follow:req.userData.follow,
        headPic:req.userData.headPic,
    }
    let loginUser = new LoginUser(userMsg);
    loginUser.save((err) => {
        if(err) {
            res.json({code:1,err:'登录失败,是否已经登录过了?或请重试...'});
        }else{
            req.session.user = userMsg._id;  // 发送session,记录信息
            res.json({code:0,err:'登录成功',userMsg:userMsg});
        }
    });
}


function logOut(req,res,next){
    LoginUser.remove({_id:req.query._id},(err) => {
        if(err) {
            console.log(err);
        }else{
            delete req.session.user;
            res.json({code:0,err:'退出登录成功'});
        }
    });
}



module.exports = router;  //挂载出口