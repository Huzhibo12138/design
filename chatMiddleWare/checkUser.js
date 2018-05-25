const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const sessionStore = new MongoStore({
    url: 'mongodb://localhost/user'
});
// 检查用户信息
function checkUser(socket,next) {
    let cookies = cookie.parse(socket.handshake.headers.cookie);   // 格式化cookie数据
    let cookiesUser = cookies.user;    //  拿到有签名的cookie
    if(cookiesUser) {   // 若存在
        let _id = cookieParser.signedCookie(cookiesUser,'hzb');   // 通过签名解析cookie内容
        if(_id) {    //  解析成功
            sessionStore.get(_id,(err,session) => {
                console.log(session);
                // socket.emit('err','123');
                next();
            });
        }else{    //  解析失败
            next();

        }
    }else{
        next();

    }
}


module.exports = checkUser;