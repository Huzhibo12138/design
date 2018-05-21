// 动态的注册js文件，主要负责与服务器交互

// 1.表单的提交事件
$(document).submit(function() {
	// 格式化表单
	var formMsg = form();
	// 表单验证
	if(!checkForm(formMsg)) {
		return false;
	}
	// 发送ajax请求，进行注册
	// $.post('regeist/reg',formMsg,function() {});
    $.ajax({
        url:'regeist/reg',
        data:formMsg,
        dataType:'json',
        timeout:1000 * 10,
        type:'post',
        success:regSuccess,
        beforeSend:() =>{model.show()},
        complete:(data) => {
        	if(data.readyState === 0) {
        		model.show('服务器开小差了,请重试');
        	}
        },
    });
    return false;
});

// 获取短信验证码事件
$('#getMsgBtn').click(function() {
	// 验证手机号是否正确
	var userIdReg =  /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
	if(!userIdReg.test( $('.phone').val() )) {
		falseMsg($('.phone'),'请输入正确的手机号码');
		return false;
	}// 滑动条的验证
    if($('.block').css('left') !== '250px') {
        falseMsg($('.move_box'),'请完成滑动验证');
        return false;
    }else{
		var data = {userId:$('.phone').val()};
		// 发送ajax请求,获取短信验证码
		$.post('regeist/getMsg',data,handelMsg);
	}
	return false;
});


// 格式化表单函数
function form() {
	var formMsg = {
		userName:$('.userId').val(),
		passwd:$('.passwd').val(),
		passwd2:$('.passwd2').val(),
		userId:$('.phone').val(),
		regMsg:$('.message').val(),
	};
	return formMsg;
}


// 表单验证函数
function checkForm(formMsg) {
	// 验证用户名
	if(formMsg.userName.length <= 1 || formMsg.userName.length >= 8) {
		falseMsg($('.userId'),'用户名不符合规则,请检查');
		return false;
	}
	// 验证第一个密码
	if(formMsg.passwd.length < 6 || formMsg.passwd.length > 12) {
		falseMsg($('.passwd'),'密码不符合规则,请检查');
		return false;
	}
	if(formMsg.passwd !== formMsg.passwd2) {
		falseMsg($('.passwd'),'两次输入的密码不一致,请检查');
		falseMsg($('.passwd2'),'两次输入的密码不一致,请检查');
		return false;
	}
	// 手机号的正则
	var userIdReg =  /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
	if(!userIdReg.test(formMsg.userId)) {
		falseMsg($('.phone'),'请输入正确的手机号码');
		return false;
	}
	// 滑动条的验证
	if($('.block').css('left') !== '250px') {
		falseMsg($('.move_box'),'请完成滑动验证');
		return false;
	}
	// 短信验证码验证
	if(formMsg.regMsg.length !== 6) {
		falseMsg($('.message'),'请输入正确的验证码');
		return false;
	}
	return true;
}


// 表单验证失败的提示信息函数
function falseMsg(obj,err) {
	obj.css('border-color','#fe5656').next().css('display','block').css('color','#fe5656').text(err);
}


// 注册请求成功执行的回调函数
function regSuccess(data) {
    if(data.code === 1) {
        // model.show(data.err);
        model.show(data.err + ' 是否现在登录');
    }else if(data.code === 0) {
        model.show(data.err + ' 是否现在登录');
        model.change('ok',function() {
            console.log(123);
            window.location.href = 'index.html?isLogin=true';
        });
    }
}

// 验证码后台数据的处理函数
function handelMsg(data) {
    if(data.code === 0) {
        $('.message').next().css('display','block').css('color','#878787').text(data.err);
        getMsgBtn();
    }else if(data.code === 1){
        falseMsg($('.message'),data.err);
        getMsgBtn();
    }else{
        falseMsg($('.message'),data.err);
    }
}

// 获取验证码按钮的计时效果
function getMsgBtn() {
    // 按钮禁用
    $('#getMsgBtn').attr('disabled','disabled').css('cursor','wait');
    var time = 60;
    setTime();
    var timer = setInterval(setTime,1000);
    // 设置计时函数
    function setTime() {
        time--;
        if(time === 0) {
            $('#getMsgBtn').text('获取短信验证码').removeAttr('disabled').css('cursor','pointer');
            clearInterval(timer);
            $('.block').css('left',0);
            $('.moveBg').css('width',0);
            return false;
        }
        $('#getMsgBtn').text('( ' + time + ' )s 后再试');
    }
}

