// 分享页面的静态交互效果
// 全局变量,记录用户登录后的信息
var model = new Model({loadingMsg:'正在拼命加载,请稍等!!!',
    title:'欢迎访问本网站',
});
var share = new Share();


;// 登录框弹出效果
$('.login').click(function() {
	$('.login_bg').css('display','block');
});



// 登录框隐藏效果
$('.login_close').click(function(ev) {
	$('.login_bg').css('display','none');
});


// 右侧框滚动下滑效果
$(document).on('scroll',function() {
	var top = $(window).scrollTop();
	if(top > 85) {
		 $('.con_right').stop(true,true).css({top:top + 10});
	}else{
		$('.con_right').stop(true,true).animate({top:0});
	}
});

// 关注用户
$('.con_left').on('click',function(ev) {
    var e = ev || window.event;
    var o = e.target || e.srcElement;
    if($(o).hasClass('user_operate') || $(o).hasClass('glyphicon-plus')) {
        var parent = $(o).parents('.share_box');
        var userName = parent.find('.user_name').text();
        var userId = parent.attr('data');
        model.show(`确定要关注<< ${userName} >>吗?`);
        model.change('ok',() => {share.follow(userId)});
    }
});
// 查看我的关注
$('.con_right').on('click',function(ev) {
    var e = ev || window.event;
    var o = e.target || e.srcElement;
    if($(o).hasClass('myFollow') || $(o).parent().hasClass('myFollow')) {
        console.log(123);
    }
});
// 无限加载效果
$(document).on('scroll',function() {
    var top = $(window).scrollTop();
    if(share.userMsg.newMsgIsOver && $('.share_box:last-child').offset() && top >= $('.share_box:last-child').offset().top - 200) {
        share.userMsg.page += 10;   //在用户浏览完此次10条动态后,记录用户的浏览状态
        share.reqShareMsg(share.userMsg);
        share.userMsg.newMsgIsOver = false;
    }
});

// 登录事件
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
        Object.assign(share.userMsg,data.userMsg);
        share.userMsg.page = 0;
        $('.login_bg').css('display','none');
        // 新用户提示
        if(share.userMsg.newUser) {
            var welMsg = '您好,亲爱的' + share.userMsg.name + ',欢迎您登录,检测到您还有一些信息并未完善,是否立即填写?';
            model.show(welMsg);
            model.change('notOk',() => {share.reLoadPage()});
            model.change('close',() => {share.reLoadPage()});
        }else{
            // 刷新页面
            share.reLoadPage();
        }
    }else{
        model.show(data.err);
    }
}


// 在页面加载结束后写入cookie记录用户此浏览状态
$(window).unload(function(){
    var str = JSON.stringify(share.userMsg);
    $.cookie('userMsg',str,{expires:7});
});


