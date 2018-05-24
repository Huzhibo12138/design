const express = require('express');
const router = express.Router();

const User = require('../business/models/user');
const Verify = require('../business/models/verify');
// 引入发送短信验证码模块
const sendRegCode = require('../business/shotMsg/sendRegisterCode');

router.post('/change',changePassword);
router.post('/getMsg',isSend,isReg,saveSendCode);
router.post('/changePasd',changePassword2);


function changePassword(req,res,next) {
    let user = {_id:req.body._id,password:req.body.oldPassword};
    let password = {$set:{password:req.body.password1}};
    console.log(user,password);
    User.update(user,password,(err) => {
        if(err) {
            res.json({code:1,err:'密码重置失败,请检查帐号是否正确,或者选择短息修改密码!!'});
        }else{
            res.json({code:0,err:'密码重置成功,请退出并重新登录'});
        }
    });
}

function isReg(req,res,next) {

}

// 验证码是否已发送
function isSend(req,res,next) {
    let userId = req.body._id;
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
    User.findOne({_id:req.body._id}, (err,data) => {
        if(err || data === null) {
            res.json({
                code:1,
                err:'帐号未注册,请核对手机号'
            });
        }else{
            next();
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
        _id:req.body._id,
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
            //发送验证码
            // sendRegCode.sendTplSms(msg._id,msg.code);   //这里需要改为Promise对象
            // 发送成功信息
            res.json( {code:0,err:'验证码已发送,请注意查收'} );
        }
    });

}



// 验证码是否已发送
function isSend2(req,res,next) {
    let userId = req.body._id;
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

function changePassword2(req,res,next) {
    console.log(req.body);
    Verify.findOne({_id:req.body.userId,code:req.body.code},(err,data) => {
        if(err || !data) {
            res.json({code:1,err:'密码重置失败,请检查验证码是否正确'});
        }else{
            if(req.body.password1 !== req.body.password2) {
                res.json({code:1,err:'两次密码不一致,请检查'});
            }else{
                User.update({_id:req.body.userId},{$set:{password:req.body.password1}},(err) => {
                    if(err) {
                        res.json({code:1,err:'密码重置失败,请重试'});
                    }else{
                        res.json({code:0,err:'密码重置成功,确定返回主页'});
                    }
                });

            }
        }
    });
    // let user = {_id:req.body._id,password:req.body.oldPassword};
    // let password = {$set:{password:req.body.password1}};
    // console.log(user,password);
    // User.update(user,password,(err) => {
    //     if(err) {
    //         res.json({code:1,err:'密码重置失败,请检查帐号是否正确,或者选择短息修改密码!!'});
    //     }else{
    //         res.json({code:0,err:'密码重置成功,请退出并重新登录'});
    //     }
    // });
}


module.exports = router;
