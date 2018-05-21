// 分享页面的静态交互效果
// 全局变量,记录用户登录后的信息
var userMsg = {};

// 1.初始化用户信息,从cookie中读取
$(function () {
    userMsg = $.cookie('userMsg');
    if(!userMsg) {
        userMsg = {
            id:'nothing',
            page:0,
            newMsgIsOver:true,
        }
    }else{
        userMsg = JSON.stringify(userMsg);
        console.log(userMsg);
    }
});




;// 2.登录框弹出效果
$('.login').click(function() {
	$('.login_bg').css('display','block');
});


// 3.登录框隐藏效果
$('.login_close').click(function(ev) {
	$('.login_bg').css('display','none');
});


// 4.生成弹出框
var model = new Model({loadingMsg:'正在拼命加载,请稍等!!!',
                        title:'欢迎访问本网站',
});


// 5.右侧框滚动下滑效果
$(document).on('scroll',function() {
	var top = $(window).scrollTop();
	if(top > 85) {
		 $('.con_right').stop(true,true).css({top:top + 10});
	}else{
		$('.con_right').stop(true,true).animate({top:0});
	}
});

// 6.无限加载效果
$(document).on('scroll',function() {
    var top = $(window).scrollTop();
    if(userMsg.newMsgIsOver && $('.share_box:last-child').offset() && top >= $('.share_box:last-child').offset().top - 300) {
        userMsg.page += 10;   //在用户浏览完此次10条动态后,记录用户的浏览状态
        reqShareMsg(userMsg);
        userMsg.newMsgIsOver = false;
    }
});

// 7.在页面加载结束后写入cookie记录用户此浏览状态
$(window).unload(function(){
    var str = JSON.stringify(userMsg);
    $.cookie('userMsg',str,{expires:7});
});


