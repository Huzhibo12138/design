var model = new Model({loadingMsg:'正在拼命加载,请稍等!!!',
    title:'欢迎访问本网站',
});
// 选项卡效果
$('.title li').on('click',function() {
	if($('.form2').hasClass('formActive')) {
		model.show('请完成密码的修改,不要乱点!!!');
		return false;
	}
	$('.title li').removeClass('active');
	$(this).addClass('active');
	var index = $('.title li').index($(this));
	$('form').removeClass('formActive');
	$('form').eq(index).addClass('formActive');
});


$('.form2Submit').on('click',function() {
	var formMsg = {
		userId:$('.form2 .userId').val(),
		code:$('.form2 .shotMsg').val(),
		password1:$('.form2 .pasd1').val(),
		password2:$('.form2 .pasd2').val(),
	}
	// 短信验证码验证
	if(formMsg.code.length !== 6) {
		model.show('请输入正确的验证码');
		return false;
	}
	// 验证第一个密码
	if(formMsg.password1.length < 6 || formMsg.password1.length > 12) {
		model.show('密码不符合规则,请检查');
		return false;
	}
	if(formMsg.password1 !== formMsg.password2) {
		model.show('两次输入的密码不一致,请检查');
		return false;
	}
	$.ajax({
		url:'retrieve/changePasd',
		data:formMsg,
		timeout:1000 * 10,
		type:'post',
		beforeSend:() => { model.show() },
        complete:(data) => {
            if (data.readyState === 0 || data.status !== 200) {
                model.show('密码修改失败,请重试');
            }
        },
        success:(data) => {
            if(data.code == 0) {
                model.show('密码修改成功!!!');
                model.change('ok',() => {
                	window.location.href = 'index.html';
                });
            }else{
                model.show(data.err);
            }
        },
	});
});
$('.form3Submit').on('click',function() {
	// 格式化信息
	var msg = {
		_id:$('.form3 .userId').val(),
		oldPassword:$('.form3 .oldPassword').val(),
		password1:$('.form3 .password1').val(),
		password2:$('.form3 .password2').val(),
	}
	// 手机号的正则
	var userIdReg =  /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
	if(!userIdReg.test(msg._id)) {
		model.show('请输入正确的手机号码');
		return false;
	}
	if(msg.oldPassword.length < 6 || msg.oldPassword.length > 12) {
		model.show('密码不符合规则,请检查');
		return false;
	}
	if(msg.password1.length < 6 || msg.password1.length > 12) {
		model.show('密码不符合规则,请检查');
		return false;
	}
	if(msg.password1 !== msg.password2) {
		model.show('两次输入的密码不一致,请检查');
		return false;
	}
	$.ajax({
		url:'retrieve/change',
		data:msg,
		timeout:1000 * 10,
		type:'post',
		beforeSend:() => { model.show() },
        complete:(data) => {
            if (data.readyState === 0 || data.status !== 200) {
                model.show('密码重置失败,请重试');
            }
        },
        success:(data) => {
            if(data.code == 0) {
                model.show('密码重置成功');
                model.change('ok',() => {
                	window.location.href = 'index.html';
                });
            }else{
                model.show(data.err);
            }
        },

	});
});
$('.getShowMsg').on('click',function() {
	var userId = {
		_id:$('.form1 .userId').val(),
	}
	var userIdReg =  /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
	if(!userIdReg.test(userId._id)) {
		model.show('请输入正确的手机号码');
		return false;
	}
	$.ajax({
		url:'retrieve/getMsg',
		data:userId,
		timeout:1000 * 10,
		type:'post',
		beforeSend:() => { model.show() },
        complete:(data) => {
            if (data.readyState === 0 || data.status !== 200) {
                model.show('获得短息验证码失败,请重试');
            }
        },
        success:(data) => {
            if(data.code == 0) {
                model.show('获得短息验证码成功,1min有效,请注意查收!!!');
				$('.form2 .userId').val(userId._id),
                $('form').removeClass('formActive');
				$('.form2').addClass('formActive');
            }else{
                model.show(data.err);
            }
        },
	});
});
