const express = require('express');
const router = express.Router();

const User = require('../business/models/user');
const LoginUser = require('../business/models/loginUser');


// 处理关注请求的流程
// 1.是否已登录2.是否已注册并关注
router.get('/addFollow',isLogin1,isRegeist);
// 处理获得关注请求的流程
// 1.是否已登录,2发送信息
router.get('/getFollow',isLogin2,sendFollow);
// 处理取消关注请求的流程
// 1.是否已登录,2,取消关注
router.get('/delFollow',isLogin3,delFollow);

// 查看用户是否已经登录1
function isLogin1(req,res,next) {
    // 构建用户信息
    let followMsg = {
        user:req.query.user,
        follow:req.query.follow,
    }
    LoginUser.findOne({_id:followMsg.user},(err,data) =>{
        if(err || !data) {
            res.json({code:1,err:'您未登录,关注失败,请重试!!!'});
        }else{
            if(data.follow.indexOf(followMsg.follow) !== -1) {
                res.json({code:1,err:'该用户您已经关注过了!!!'});
            }else{
                req.followMsg = followMsg;
                next();
            }
        }
    });
}
// 是否已注册并关注
function isRegeist(req,res,next) {
    let followMsg = req.followMsg;
    console.log(followMsg);
    User.findOne({_id:followMsg.user},{follow:1},(err,data) => {
        if(err || !data) {
            res.json({code:1,err:'关注失败,请重试'});
        }else{
            if(data.follow.indexOf(followMsg.follow) !== -1){
                res.json({code:1,err:'该用户您已经关注过了!!!'});
            }else{
                data.follow.push(followMsg.follow);
                User.update({_id:data._id},{$set:{follow:data.follow}},(err) => {
                    if(err) {
                        res.json({code:1,err:'关注失败,请重试'});
                    }else{
                        res.json({code:0,err:'关注成功',follow:data.follow});
                    }
                });
            }
        }
    });
}


//查看用户是否已经登录2
function isLogin2(req,res,next) {
    // 构建用户信息
    let data = {
        _id:req.query._id,
    }
    LoginUser.findOne({_id:data._id},(err,data) =>{
        if(err || !data) {
            res.json({code:1,err:'您未登录,请重试!!!'});
        }else{
            next();
        }
    });
}
// 发送关注信息
function sendFollow(req,res,next) {
    User.findOne({_id:req.query._id},{follow:1},(err,data) => {
        if(err || !data) {
            res.json({code:1,err:'获取关注列表失败,请重试!!!'});
        }else{
            let query = {_id:{'$in':data.follow}};
            console.log(query);
            User.find(query,{name:1,headPic:1},(err,data) => {
                if(err || !data) {
                    res.json({code:1,err:'获取关注列表失败,请重试!!!'});
                }else{
                    res.send({code:0,err:'获取关注列表成功',data:data});
                }
            });
        }
    });
}

//查看用户是否已经登录3
function isLogin3(req,res,next) {
    LoginUser.findOne({_id:req.query.user},(err,data) =>{
        if(err || !data) {
            res.json({code:1,err:'您未登录,请重试!!!'});
        }else{
            next();
        }
    });
}
function delFollow(req,res,next) {
    User.findOne({_id:req.query.user},{follow:1},(err,data) =>{
        if(err || !data) {
            res.json({code:1,err:'取消关注失败,请重试!!!'});
        }else{
            let followList = data.follow;
            console.log(followList);
            let index = followList.indexOf(req.query.follow);
            followList.splice(index,1);
            User.update({_id:req.query.user},{$set:{follow:followList}},(err) => {
                if(err) {
                    res.json({code:1,err:'取消关注失败,请重试'});
                }else{
                    res.json({code:0,err:'取消关注成功'});
                }
            });
        }
    });
}



module.exports = router;