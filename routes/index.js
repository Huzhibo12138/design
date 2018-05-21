const express = require('express');
const router = express.Router();

const User = require('../business/models/user');
const ShareMsg = require('../business/models/shareMsg');


// 给用户发送信息 工作流程 1；判断用户请求内容
// 未登录用户：2.1,拿去指定的用户信息,2.2查询发表动态的用户信息并发送数据
router.get('/getShareMsg',searchShareMsg,searchUser);

function searchShareMsg(req,res,next) {
    // 格式化请求内容
    let reqMsg = {
        userId:req.query.id,
        page:parseInt(req.query.page) || 0,
    }
    console.log(reqMsg);
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
    }
}

function searchUser(req,res,next) {
    let arrUser = [];
    // 遍历数组,拿取需要查询的用户信息
    req.shareMsg.forEach( v => {
        arrUser.push(v.userId);
    });
    arrUser = [...(new Set(arrUser))]; //数组去重
    // Model.find({“age”:{ “$in”:[20,21,22.‘haha’]} } );
    let query = {_id:{'$in':arrUser}};
    User.find(query,{name:1,headPic:1},(err,data) => {
        if(err || !data) {
            res.json({code:1,err:'服务器出错，请重试！！'});
        }else{
            setTimeout(() => {res.json(combineMsg(req.shareMsg,data));},5000);
            // res.json(combineMsg(req.shareMsg,data));   // 拿到所有的动态发表者的信息
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