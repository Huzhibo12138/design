// 此文件主要处理与服务器交互的逻辑

// 1.初始化界面函数,分为两部分,未传参数时,拿取默认动态,传入userId时拿取用户关心的数据
function reFreshWindow(userMsg) {
	if(!userMsg) {  // 没有用户信息,用户未登录,拿取默认的动态供用户浏览
		writeUserName('新的游客');
		reqShareMsg(); //拿取默认动态
	}
}
// 1.1初始化用户姓名,头像
function writeUserName(userName) {
	$('.headerUserName').text(userName);
	$('.owner_name').text(userName);
	$('.owner_pic').find('img').attr('src','../img/heart.jpg');
}
// 1.2初始化动态消息，传入信息,生成分享框并插入到页面
function createMsg(msg) {
	// 生成文档的内容
	var conStr = `<div class="share_box">
            <div class="tit_box">
                <a href="javascript:;" class="user_pic">
                    <img src="${msg.ownPic}" alt="">
                </a>
                <p class="user_name">${msg.ownName}</p>
                <button class="user_operate"><i class="glyphicon glyphicon-plus"></i>关注</button>
                <p class="user_msg">${msg.time}</p>
            </div>
            <div class="share_box_con">
                <p class="share_article">${msg.con}</p>
                <div class="share_pic_box">
                    <div><img src="img/chet_bg.jpg"></div>
                </div>
            </div>
            <div class="share_bottom">
                <ul>
                    <li><i class="glyphicon glyphicon-comment"></i>评论<span>${msg.talk}</span></li>
                    <li><i class="glyphicon glyphicon-thumbs-up"></i>${msg.good}</li>
                </ul>
            </div>
        </div>`;
    // 插入图片
    var shareBox = $(conStr);
    var share_pic_box = shareBox.find('.share_pic_box');
    msg.imgs.forEach((v) => {
    	var imgStr = `<div><img src="${v}"></div>`;
    	share_pic_box.append($(imgStr));
    });
    $('.con_left').append(shareBox);
}


// 1.3 向服务器发起请求,请求数据,支持参数,_id,用户的id
function reqShareMsg(follow) {
	follow = follow || 'id=nothing';
	$.ajax({
		url:'index/getShareMsg',
		type:'get',
		data:follow,
		success:handelShareMsg,
		timeout:1000 * 15,  //15秒延迟
		beforeSend:()=>{model.show()},
		complete:(data) => {
			if(data.readyState === 0 || data.status !== 200) {
        		model.show('数据获取失败,请重试');
        		model.change('ok',() => {
        			reqShareMsg(follow);
        		});
        	}
		},
	});
}

var msg = {
	ownPic:'img/headpic.jpg',
	ownName:'莫关于',
	time:'5.21',
	con:'这是分享的内容这是分享的内容这是分享的内容这是分享的内容这是分享的内容这是分享的内容这是分享的内容这是分享的内容这是分享的内容这是分享的内容这是分享的内容这是分享的内容这是分享的内容这是分享的内容这是分享的内容',
	talk:'5123',
	good:'123',
	imgs:['img/chet_bg.jpg','img/chet_bg.jpg','img/chet_bg.jpg','img/chet_bg.jpg','img/chet_bg.jpg'],
}
// 1.4 处理后台返回的数据
function handelShareMsg(data) {
	model.hide();
	data = data || [];
	data.forEach((v,k) => {
		var msg = {
			ownPic:'img/headpic.jpg',
			ownName:123,
			time:v.time,
			con:v.con,
			talk:'123',
			good:'123',
			imgs:v.imgs,
		}
		createMsg(msg);
	});
}
// 1.初始化界面
reFreshWindow();

// 2.登录事件
$('.login_form').submit(function() {
	// 格式化请求数据
	var userMsg = {
		_id:this.userId.value,
		password:this.password.value,
	}
	var userIdReg =  /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
	if(!userIdReg.test(userMsg._id)) {
		model.show('手机号输入有误,请检查');
		return false;
	}else if(userMsg.password.length <6 || userMsg.password.length > 12){
		model.show('密码格式有误,请检查');
		return false;
	}
	// 发送登录请求
	$.ajax({
		url:'login',
        data:userMsg,
        dataType:'json',
        timeout:1000 * 10,
        type:'post',
        beforeSend:() =>{model.show()},
        success:loginSuccess,
        complete:(data) => {
        	if(data.readyState === 0) {
        		model.show('服务器开小差了,请重试');
        	}
        }
	});
});
// 2.1.登录成功的回调函数
function loginSuccess(data) {
	if(data.code === 0) {
		userMsg = data.userMsg;
		// 新用户提示
		if(userMsg.newUser) {
			var welMsg = '您好,亲爱的' + userMsg.name + ',欢迎您登录,检测到您还有一些信息并未完善,是否立即填写?';
			model.show(welMsg);
			// model.change('ok',() => {window.location.href=''});
			// 初始化界面
			reFreshWindow(userMsg);
		}
	}else{
		model.show(data.err);
	}
}


