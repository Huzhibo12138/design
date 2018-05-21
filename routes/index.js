const express = require('express');
const router = express.Router();

const User = require('../business/models/user');
const ShareMsg = require('../business/models/shareMsg');


// 给用户发送信息 工作流程 1；判断用户请求内容
// 未登录用户：2.1,拿去指定的用户信息
router.get('/getShareMsg',sendShareMsg);

function sendShareMsg(req,res,next) {
    // 格式化请求内容
    let reqMsg = {
        userId:req.query.id,
        page:req.query.page || 0,
    }
    if(reqMsg.userId === 'nothing') {  // 无用户，推送默认信息
        ShareMsg.find({},(err,data) => {
            if(err || !data) {
                res.json({code:1,err:'服务器出错，请重试！！'});
            }else{
                res.json(data);
            }
        }).skip(reqMsg.page).limit(10);
    }
}

module.exports = router;  //挂载出口