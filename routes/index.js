const path = require('path');
const express = require('express');
const router = express.Router();

const User = require('../business/models/user');
const ShareMsg = require('../business/models/shareMsg');
const LoginUser = require('../business/models/loginUser');


router.get('/getDefaultShareMsg',searchDefaultShareMsg,searchUser);
router.get('/getFollowShareMsg',searchFollowShareMsg,searchUser);
router.get('/getMyShare',isLogin,sendShareMsg);
router.get('/deleteMyShare',isLogin,deleteMyShare);

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
    ShareMsg.find({userId:req.query._id},(err,data) => {
        if(err || !data) {
            res.json({code:1,err:'您的动态获取失败,是否还未发表动态?'});
        }else{
            let shareMsg = data;
            User.findOne({_id:req.query._id},(err,data) => {
                if(err || !data) {
                    res.json({code:1,err:'您的动态获取失败,是否还未注册?'});
                }else{
                    let result = shareMsg.map( v => {
                        return {
                            msgNum:v._id,
                            headPic:data.headPic,
                            ownName:data.name,
                            time:dateToStr(v.time),
                            con:v.con,
                            talk:123,
                            good:v.good,
                            imgs:v.imgs,
                        }
                    });
                    res.json({code:0,err:'数据获取成功',data:result});
                }
            });
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
        msg.time = dateToStr(v.time);
        return msg;
    });
}

function deleteMyShare(req,res,next) {
    ShareMsg.remove({_id:req.query.msgNum,userId:req.query._id},(err) => {
        if(err) {
            res.json({code:1,err:'动态删除失败!!!'});
        }else{
            res.json({code:0,err:'动态删除成功!!!'});
        }
    });
}

// 将日期对象转为年月日
function dateToStr(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return (year + '年 ' + month + '月 ' + day + '日 ' + hour + ':' + minutes);
}








module.exports = router;  //挂载出口