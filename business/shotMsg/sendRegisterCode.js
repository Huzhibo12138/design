// 主要用来发送验证码
const https = require('https');
const qs = require('querystring');
const config = require('../configs/config');

// 我的短信api验证码
const APIKEY = config.smsApikey;

// 短短信目标
// let mobile = '18629405024';

// 指定模版
const TPL_ID = 2264588;

// 发送的内容
// const TPL_VALUE = {'#code#':'123412','#app#':'星心网'};

// 查询用户账户ip
const GET_USER_INFO_URI = '/v2/user/get.json';

// 模版短息https地址
const SMS_HOST = 'sms.yunpian.com';
const SEND_SMS_URI = '/v2/sms/single_send.json';

// 指定模版短信的https地址
const SEND_TPL_SMS_URI = '/v2/sms/tpl_single_send.json';

// 查询用户账户信息函数
function querryUserInfo(uri,apikey) {
    let postData = {
        'apikey': apikey,
    };
    let content = qs.stringify(postData);
    post(uri,content,SMS_HOST);
}

// 发送模版短息函数
exports.sendTplSms = function(mobile,code) {
    let tplValue = {
        '#code#': code,
        '#hour#': '3min',
    }
    let postData = {
        'apikey': APIKEY,
        'mobile': mobile,
        'tpl_id':TPL_ID,
        'tpl_value': qs.stringify(tplValue),
    };
    let content = qs.stringify(postData);
    post(SEND_TPL_SMS_URI,content,SMS_HOST);
}


// 发送模块
function post(uri,content,host) {
    let options = {
        hostname: host,
        post:443,
        path:uri,
        method:'POST',
        header:{
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    };
    var req = https.request(options,function(res){
        // console.log('STATUS: ' + res.statusCode);
        // console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log('BODY' + chunk);
        });
    });
    //console.log(content);
    req.write(content);
    req.end();
}

