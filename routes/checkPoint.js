const express = require('express');
const router = express.Router();

// 判断请求方式,若为不允许的操作,则检查session,若不通过,则拒绝
router.all('*',function(req,res,next) {
    const fullURL = req.originalUrl.split('?')[0];
    var index = allowPath.indexOf(fullURL);
    if(index === -1) {   // 不允许的路由
        if(req.session.user) {
            next();
        }else{
            res.json({code:1,err:'身份认证失败,请尝试重新登录!!!'});
        }
    }else{
        next();
    }
});


// 不用检查的路径
let allowPath = [
    '/index/getFollowShareMsg',
    '/index/getDefaultShareMsg',
    '/regeist/getMsg',
    '/regeist/reg',
    '/login/in',
    '/login/out',
];




module.exports = router;