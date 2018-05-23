const path = require('path');
const express = require('express');
const router = express.Router();

const User = require('../business/models/user');
const ShareMsg = require('../business/models/shareMsg');
const LoginUser = require('../business/models/loginUser');


router.get('/getDefaultShareMsg',searchDefaultShareMsg,searchUser);
router.get('/getFollowShareMsg',searchFollowShareMsg,searchUser);
router.get('/getMyShare',isLogin,sendShareMsg)

function searchDefaultShareMsg(req,res,next) {
    // 格式化请求内容
    let reqMsg = {
        userId:req.query._id,
        page:parseInt(req.query.page) || 0,
    }
    if(reqMsg.userId === 'nothing') {  // 无用户，推送默认信息
        ShareMsg.find({},(err,data) => {
            if(err || !data) {
                res.json({code:1,err:'服务器出错，请重试！！'});
            }else{
                //暂时不会更好的解决方案,查询两次
                req.shareMsg = data;
                next();
            }
        }).skip(reqMsg.page).limit(10);
    }else {

    }
}

function searchUser(req,res,next) {
    let arrUser = [];
    // 遍历数组,拿取需要查询的用户信息
    req.shareMsg.forEach( v => {
        arrUser.push(v.userId);
    });
    arrUser = [...(new Set(arrUser))]; //数组去重
    let query = {_id:{'$in':arrUser}};
    User.find(query,{name:1,headPic:1},(err,data) => {
        if(err || !data) {
            res.json({code:1,err:'服务器出错，请重试！！'});
        }else{
            res.json(combineMsg(req.shareMsg,data));
        }
    });
}


function searchFollowShareMsg(req,res,next) {
    // 格式化请求内容
    let reqMsg = {
        userId:req.query._id,
        page:parseInt(req.query.page) || 0,
    }
    if(reqMsg.userId) {  // 无用户，推送默认信息
        ShareMsg.find({},(err,data) => {
            if(err || !data) {
                res.json({code:1,err:'服务器出错，请重试！！'});
            }else{
                //暂时不会更好的解决方案,查询两次
                req.shareMsg = data;
                next();
            }
        }).skip(reqMsg.page).limit(10);
    }else {

    }
}

function isLogin(req,res,next) {
    LoginUser.findOne({_id:req.query._id},(err,data) => {
        if(err || !data) {
            res.json({code:1,err:'您还未登录,请登录!!'});
        }else{
            next();
        }
    });
}

function sendShareMsg(req,res,next) {
    console.log(req.query);
    ShareMsg.find({userId:req.query._id},(err,data) => {
        if(err || !data) {
            res.json({code:1,err:'您的动态获取失败,是否还未发表动态?'});
        }else{
            let shareMsg = data.map( v => {
                let msg = JSON.parse(JSON.stringify(v));
                msg.name = req.query.name;
                msg.id = v._id;
                msg.ownPic = 123123;
                return msg;
            });
            console.log(shareMsg);
            res.json({code:0,data:shareMsg});
        }
    });
}
// 将动态与用户信息组合
function combineMsg(shareMsg,shareUser) {
    let user = {};    // 重新构建shareUser结构,方便下次遍历
    shareUser.forEach(v => {
        user[v._id] = v;
    });
    return shareMsg.map(v => {
        let msg = JSON.parse(JSON.stringify(v));
        msg.name = user[v.userId].name;
        msg.headPic = user[v.userId].headPic;
        return msg;
    });
}








module.exports = router;  //挂载出口