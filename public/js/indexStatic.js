// 分享页面的静态交互效果
// 全局变量,记录用户登录后的信息
var userMsg = {};

;// 1.登录框弹出效果
$('.login').click(function() {
	$('.login_bg').css('display','block');
});
// 2.登录框隐藏效果
$('.login_close').click(function(ev) {
	$('.login_bg').css('display','none');
});

// 3.生成弹出框
var model = new Model({loadingMsg:'正在拼命加载,请稍等!!!',
                        title:'欢迎访问本网站',
});

// 4.右侧框滚动下滑效果
$(document).scroll(function() {
	var top = $(window).scrollTop();
	if(top > 85) {
		 $('.con_right').stop(true,true).css({top:top + 10});
	}else{
		$('.con_right').stop(true,true).animate({top:0});
	}
});

