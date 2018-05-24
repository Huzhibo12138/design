const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const LoginUser = require('../business/models/loginUser');
const User = require('../business/models/user');
const ShareMsg = require('../business/models/shareMsg');



let picName = 'public/userImgs/';
//将图片放到服务器
let storage = multer.diskStorage({
    destination: picName,
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        var extname = path.extname(file.originalname);
        var picName = req.query.id+ '.' + new Date().getTime() + extname;
        req.headPic = ('userImgs/' + picName);
        cb(null,picName);
    }
});

let upload = multer({
    storage: storage
});
// 发表动态的流程,1.用户是否登录 2是否有权限 3.图片入库 4.动态入库
router.post('/',isLogin,upload.single('file'),writeDb);


function isLogin(req,res,next) {
    LoginUser.findOne({_id:req.query.id},(err,data) => {
        if(err || !data) {
            res.json({code:1,err:"补全信息失败,是否未登录!!!"});
        }else{
            next();
        }
    });
}

function writeDb(req,res,next) {
    User.update({_id:req.query.id},{$set:{sex:req.query.sex,headPic:req.headPic,newUser:false}},(err) => {
        if(err) {
            res.json({code:1,err:'补全信息失败,请重试'});
        }else{
            res.json({code:0,err:'信息补全成功'});
        }
    });
}

module.exports = router;