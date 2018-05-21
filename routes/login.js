const express = require('express');
const router = express.Router();


const User = require('../business/models/user');
const LoginUser = require('../business/models/loginUser');
// 处理登录请求的流程 1:校验数据,查库 2.用户入登录库
router.post('/',checkMsg,wirteDb);

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
    }
    let loginUser = new LoginUser(userMsg);
    loginUser.save((err) => {
        if(err) {
            req.session.loginUser = userMsg._id;  // 发送session,记录信息
            res.json({code:1,err:'登录失败,是否已经登录过了?或请重试...'});
        }else{
            res.json({code:0,err:'登录成功',userMsg:userMsg});
        }
    });
}




module.exports = router;  //挂载出口