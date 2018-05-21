const express = require('express');
const app = express();

const server = require('http').Server(app);
const path = require('path');

const io = require('socket.io')(server);

server.listen(80,() => {
    console.log('服务器已启动，正在监听8888端口');
});

app.get('/',(req,res) => {
    res.redirect('/chet.html');
});

app.use('/',express.static(path.join(__dirname,'./public')));
const users = [];
let usersNum = 0;
// 连接事件
io.on('connection',(socket) => {
    usersNum++;
    console.log(`当前有${usersNum}个用户建立连接`);
    // 监听用户登录事件
    socket.on('login',(data) => {
        users.push({
            userName: data.userName,
            message:[]
        });
        socket.emit('loginSuccess',data);
    });

    // 监听用户退出事件
    socket.on('disconnect',() => {
        usersNum--;
        console.log(`当前有${usersNum}个用户连接上服务器了`);
    });

    // 监听客户端的发送消息事件
    socket.on('sendMessage',(data)=>{
        for(let user of users) {
            if(user.userName === data.userName) {
                user.message.push(data.message);
                //信息存储之后触发receiveMessage将信息发给所有浏览器
                io.emit('receiveMessage',data);
                break;
            }
        }
    });
});