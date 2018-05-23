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
        req.picArr.push('userImgs/' + picName);
        cb(null,picName);
    }
});

let upload = multer({
    storage: storage
});
// 发表动态的流程,1.用户是否登录 2是否有权限 3.图片入库 4.动态入库
router.post('/addShare',isLogin,isPower,upload.array('file',6),writeShare);


function isLogin(req,res,next) {
    LoginUser.findOne({_id:req.query.id},(err,data) => {

        if(err || !data) {
            res.json({code:1,err:"发表动态失败,是否未登录!!!"});
        }else{
            next();
        }
    });
}

function isPower(req,res,next) {
    User.findOne({_id:req.query.id},{identity:1},(err,data) => {
        if(err || !data) {
            res.json({code:1,err:"发表动态失败,您是否注册?"});
        }else{
            if(data.identity < 2) {
                res.json({code:2,err:"权限不够,发表动态失败,是否立即提升权限(身份认证)!!!"});
            }else{
                req.picArr = [];
                next();
            }
        }
    });
}

function writeShare(req,res,next) {
    // 构建分享动态信息
    let shareMsg = new ShareMsg({
        userId:req.query.id,
        time:new Date(),
        con:req.query.con,
        talk:{},
        good:0,
        imgs:req.picArr,
    });
    shareMsg.save((err) => {
        if(err) {
            res.json({code:1,err:'动态发表失败,请重试!!!'});
        }else{
            res.json({code:0,err:'动态发表成功!!!'});
            console.log(123);
        }
    });

}

//
// let shareMsgSchema = new Schema({
//     // _id:String,
//     userId:String,
//     time:Date,
//     con:String,
//     talk:Object,
//     good:String,
//     imgs:Array,
// });

module.exports = router;