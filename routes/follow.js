const express = require('express');
const router = express.Router();

const User = require('../business/models/user');
const LoginUser = require('../business/models/loginUser');


// 处理关注请求的流程
// 1.是否已登录2.是否已注册并关注

router.get('/',isLogin,isRegeist);


// 查看用户是否已经登录
function isLogin(req,res,next) {
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




module.exports = router;