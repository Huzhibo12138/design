const express = require('express');
const router = express.Router();
// 格式化时间模块
const moment = require('moment')();
// 引入发送短信验证码模块
const sendRegCode = require('../business/shotMsg/sendRegisterCode');
// 引入数据库验证码模块
const Verify = require('../business/models/verify');
// 引入数据库用户模块
const User = require('../business/models/user');


// 设置处理获得验证码的请求的工作流程：1.是否已发送  2.是否已注册 3.生成,存储,并发送验证码
router.post('/getMsg',isSend,isReg,saveSendCode);

// 设置处理注册请求的工作流程：1.数据校验 2.是否已注册 3.用户入库
router.post('/reg',checkMsg,isReg,userReg);


// 验证码是否已发送
function isSend(req,res,next) {
    let userId = req.body.userId;
    let userIdReg =  /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
    if(!userIdReg.test(userId)) {
        res.json({
            code:1,
            err:'手机格式错误'
        });
    }else{
        // 查找验证码表，检查是否已经发送过验证码
        Verify.findOne({_id:userId}, (err,data) => {
            if(err || data === null) {
                req.userId = userId;
                next();
            }else{
                res.json({
                    code:1,
                    err:'验证码已经发送过了，请1min后再试'
                });
            }
        });
    }
}
// 用户是否已注册
function isReg(req,res,next) {
    User.findOne({_id:req.userId}, (err,data) => {
        if(err || data === null) {
            next();
        }else{
            res.json({
                code:1,
                err:'该用户已经注册,请核对手机号'
            });
        }
    });
}
// 生成,存储,发送验证码
function saveSendCode(req,res,next) {
    // 生成验证码
    let code = '';
    for(let i = 0; i < 6; i++) {
        code += Math.floor( Math.random() * 10);
    }
    // 格式化验证码信息
    let msg = new Verify( {
        _id:req.userId,
        code:code,
        createAt: new Date(),
        reqTime:1
    });
    // 验证码入库
    msg.save((err) => {
        if(err) {
            console.log(msg._id + '的验证码入库失败,请检查');
        }else{
            req.body.msg = msg;
        }
    });
    //发送验证码
    sendRegCode.sendTplSms(msg._id,msg.code);   //这里需要改为Promise对象
    // 发送成功信息
    res.json( {code:0,err:'验证码已发送,请注意查收'} );
}


// 校验注册信息
function checkMsg(req,res,next) {
    // 格式化请求数据
    let userMsg = {
        _id: req.body.userId,
        name: req.body.userName,
        password: req.body.passwd,
        password2: req.body.passwd2,
        regMsg:req.body.regMsg,
    }
    // 表单验证
    let checkResult = checkUserMsg(userMsg);
    if(!checkResult || checkResult.code === 1) {
        res.json(checkResult);
        return false;
    }else{
        // 查找验证码表，检查验证码是否正确
        Verify.findOne({_id:userMsg._id,code:userMsg.regMsg}, (err,data) => {
            if(err || data === null) {
                console.log({_id:userMsg._id,code:userMsg.regMsg});
                res.json({
                    code:1,
                    err:'请检查您的验证码是否正确',
                });
            }else{
                // 找到数据,验证码校验通过,交付下一个路由
                req.userId = userMsg._id;
                next();
            }
        });
    }
}
// 新用户入库函数
function userReg(req,res) {
    // 构建用户信息
    let userMsg = new User({
        _id: req.body.userId,
        name: req.body.userName,
        password: req.body.passwd,
        regMsg:req.body.regMsg,
        identity:1,
        newUser:true,
        sex:1,
        birthday:'default',
        headPic:'../img/heart.jpg',
        follow:[],
    });
    userMsg.save((err) => {
        if(err) {
            console.log(msg._id + '的验证码入库失败,请检查');
            res.json( {code:1,err:'服务器错误,注册失败,要不过会再试?'} );
        }else{
            res.json( {code:0,err:'注册成功'} );
        }
    });

}

// 表单验证函数
function checkUserMsg(userMsg) {
    // 验证用户名
    if(userMsg.name.length < 2 || userMsg.name.length >= 8) {
        return {code:1,err:'请检查您的用户名'};
    }
    // 验证第一个密码
    if(userMsg.password.length < 6 || userMsg.password.length > 12) {
        return {code:1,err:'请检查您的密码'};
    }
    if(userMsg.passwd !== userMsg.passwd2) {
        return {code:1,err:'两次的密码必须一致'};
    }
    // 手机号的正则
    let userIdReg =  /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
    if(!userIdReg.test(userMsg._id)) {
        return {code:1,err:'手机号码格式有误，请检查'};
    }
    // 短信验证码验证
    if(userMsg.regMsg.length !== 6) {
        return {code:1,err:'短信验证码格式有误'};
    }
    return true;
}



module.exports = router;  //挂载出口