// 静态注册js文件，主要负责与静态交互效果
// 输入框为空验证,封装为函数
function check(obj,err,msg) {
	obj.on('focus',function() {
		obj.css('border-color','#cbcbcb').next().css('display','block').css('color','#878787').text(msg);
	});
	obj.on('blur',function() {
		if(obj.val() === '') {
			obj.css('border-color','#fe5656').next().css('display','block').css('color','#fe5656').text(err);
		}else{
			obj.next().css('display','none');
		}
	});
}

// 提示信息
check($('.userId'),'请输入用户名','2-8个字符,若您是公众人物,建议用真实姓名');
check($('.passwd'),'请输入密码','6-12个字符,建议由字母,数字,符号两种以上组成');
check($('.passwd2'),'请再次输入密码,必须与前一密码一致','请再次输入密码');
check($('.phone'),'请输入手机号','请输入您的手机号');
check($('.message'),'请输入短信验证码','请输入您的短信验证码');

// 滑动验证效果
$(function() {
	// 取消拖蓝
	$('.move').on('selectstart',function() {return false});
	// 滑块的移动效果
	var nowX = null;
	var width = null;
	$('.block').on('mousedown',function(ev) {
		$('#move_span').css('display','none');
		nowX = ev.offsetX;
		$(document).on('mousemove',start);
		$(document).on('mouseup',end);
	});
	function start(ev) {
		width = ev.pageX - $('.block').offsetParent().offset().left - nowX;
		if(width >= 250) {
			width = 250;
			// $('.block').off('mousedown');
		}
		$('.block').css('left',width);
		$('.moveBg').css('width',width);
	}
	function end() {
		$(document).off('mousemove',start);
		if(width < 250) {
			$('.block').css({left:0},'slow');
			$('.moveBg').css({width:0},'slow');
			$('#move_span').css('display','block');
			width = null;
		}
		nowX = null;
	}
});

// 生成模态框
var model = new Model({loadingMsg:'正在拼命给您注册,请稍等!!!',
                        title:'欢迎注册',
});
