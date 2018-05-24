// 分享页面的静态交互效果
// 全局变量,记录用户登录后的信息
var model = new Model({loadingMsg:'正在拼命加载,请稍等!!!',
    title:'欢迎访问本网站',
});
var share = new Share();


;// 登录框弹出效果
$('.login').click(function() {
    if(share.userMsg._id !== 'nothing') {
        model.show(`亲爱的${share.userMsg.name},您已经登录过了,是否退出并重新登录!`);
        model.change('ok',() => {
            console.log(123);
            model.hide();
        });
        return false;
    }
    $('.login_bg').css('display','block');

});
// 登录框隐藏效果
$('.login_close').click(function(ev) {
	$('.login_bg').css('display','none');
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
        url:'login/in',
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
        console.log(share.userMsg);
        $.cookie('userMsg',JSON.stringify(share.userMsg));
        $('.login_bg').css('display','none');
        // 新用户提示
        if(share.userMsg.newUser) {
            var welMsg = '您好,亲爱的' + share.userMsg.name + ',欢迎您登录,检测到您还有一些信息并未完善,是否立即填写?';
            model.show(welMsg);
            model.change('ok',() => { window.location.href = 'supply.html' });
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

// 退出登录
$('.logOut').on('click',() => {
    logOut();
});
// 退出函数
function logOut() {
    if(share.userMsg._id == 'nothing') {
        model.show('亲爱的游客,您还没有登录,是否登录?');
        model.change('ok',() => {
            $('.login_bg').css('display','block');
            model.hide();
        });
    }else{
        var data = {
            _id:share.userMsg._id,
        }
        model.show(`亲爱的${share.userMsg.name},您确定要退出吗?`);
        model.change('ok',() => {
            $.ajax({
                url:'login/out',
                data:data,
                timeout:1000 * 10,
                beforeSend:() => {
                    model.show();
                },
                complete:(data) => {
                    if (data.readyState === 0 || data.status !== 200) {
                        model.show('服务器开小差了,请重试');
                    }
                },
                success:(data) => {
                    if(data.code == 0) {
                        logOutSuccess();
                    }else{
                        model.show(data.err);
                    }
                },
            });
        });
    }
}
// 退出登录成功的函数
function logOutSuccess() {
    model.show('退出登录成功');
    // 重置cookie
    var str = JSON.stringify({});
    $.cookie('userMsg',str);
    share.initUserMsg();
    share.writerUserName();
}


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
    if($(o).hasClass('user_operate') && !$(o).hasClass('delete_share') || $(o).hasClass('glyphicon-plus')) {
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
        if(share.userMsg._id == 'nothing') {
            model.show('亲爱的游客,您还未登录,是否登录?');
            model.change('ok',() => {
                $('.login_bg').css('display','block');
                model.hide();
            });
            return false;
        }
        $('.my_follow_bg').fadeToggle();
        share.askFollowMsg();
    }
});
$('.my_follow_bg').on('click',function(ev) {
    var e = ev || window.event;
    var o = e.target || e.srcElement;
    if($(o).hasClass('follow_close')) {
        $('.my_follow_bg').slideToggle();
    }
    if(o.tagName == 'BUTTON') {
        model.show(`您确定要取消对<<${$(o).prev().text()}>>的关注吗??`);
        model.change('ok',() =>{
            share.delFollow($(o).parent().attr('data'));
        });
    }
});

// 发表动态
$('.con_right').on('click',function(ev) {
    var e = ev || window.event;
    var o = e.target || e.srcElement;
    if($(o).hasClass('sendShare') || $(o).parent().hasClass('sendShare')) {
        if(share.userMsg._id == 'nothing') {
            model.show('亲爱的游客,您还未登录,是否登录?');
            model.change('ok',() => {
                $('.login_bg').css('display','block');
                model.hide();
            });
            return false;
        }else{
            $('.send_share_bg').fadeToggle();
        }
    }
});

$('.send_share_close').click(function() {
    $('.send_share_bg').fadeOut();
});

$('.send_share_box_picList').on('click',function(ev) {
    var e = ev || window.event;
    var o = e.target || e.srcElement;
    var oLi = $(o).parents('li');
    if(oLi.hasClass('delete_pic')){
        delete $('.addInputBox')[0].files[0];
    }else if($(o).hasClass('send_share_close')){
        $('.send_share_bg').css('display','none');
    }
});

$('.addPic').click(function() {
    $('.addInputBox').trigger('click');
});

$('.send_share_bg button').click(function() {
    var con = $('.send_share_box').val();
    if(con == ''){
        model.show('亲爱的用户,发表的内容不能为空');
        return false;
    }
    var data = {
        id:share.userMsg._id,
        con:con,
    }
    // 合成信息
    var formFile = new FormData();
    for(var i = 0; i < $('.addInputBox')[0].files.length; i++) {
        formFile.append('file',$('.addInputBox')[0].files[i]);
    }
    var str =`id=${share.userMsg._id}&con=${con}`;
    $.ajax({
        url:'share/addShare?' + str,
        data:formFile,
        type:'post',
        dataType: "json",
        cache: false,//上传文件无需缓存
        processData: false,//用于对data参数进行序列化处理 这里必须false
        contentType: false, //必须
        timeout:1000 * 10,
        beforeSend:() =>{
            model.show();
        },
        complete:(data) => {
            if(data.readyState === 0 || data.status !== 200) {
                model.show('动态发表失败,请重试!!!');
                model.change('ok',() => {
                });
            }
        },
        success:(data) => {
            if(data.code == 0) {
                model.show('动态发表成功!!!');
                $('.send_share_bg').fadeToggle();
                $('.send_share_box').val('');
                $('.delete_pic').remove();
                $('.addPic').css('display','block');
                $('.addInputBox').val('');
            }else if(data.code == 2){
                model.show(data.err);
                model.change('ok',() => {
                    window.location.href = 'apply.html';
                });
            }else{
                model.show(data.err);
            }
        },
    });
});

$('.addInputBox').on('change',function() {
    if(this.files.length >6) {
        model.show('亲爱的用户,我们一次只能发表6张照片,请仔细挑选!!!');
        this.value = '';
    }else if(this.files.length == 0) {
        return false;
    }else{
        $('.addPic').css('display','none');
        createSahrePic(Array.from(this.files));
    }
});

function createSahrePic(files) {
    files.forEach(v => {
        var url = getObjectURL(v);
        var str = `<li class="delete_pic">
                       <div class="shadow">
                           <i class="glyphicon glyphicon-remove delete"></i>
                       </div>
                       <img src="${url}" alt="">
                   </li>`;
        $('.addPic').before($(str));
    });
}

//建立一個可存取到該file的url
function getObjectURL(file) {
    var url = null ;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file) ;
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file) ;
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
    }
    return url ;
}

// 获得我的动态
$('.getMyShare').on('click',function() {
    if(share.userMsg._id == 'nothing') {
        model.show('亲爱的游客,您还未登录,是否登录?');
        model.change('ok',() => {
            $('.login_bg').css('display','block');
            model.hide();
        });
        return false;
    }else{
        share.getMyShare();
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

// 删除动态
$('.con_left').on('click',function(ev) {
    var e = ev || window.event;
    var o = e.target || e.srcElement;
    if($(o).hasClass('delete_share')) {
        model.show('确定要删除此条动态吗?');
        model.change('ok',() => {
            share.deleteMsg($(o).parents('.share_box').attr('data'),$(o).parents('.share_box'));
            model.hide();
        });
    }
});

// 回到首页
$('.fontPage').on('click',function() {
    share.reLoadPage();
});

// // 点赞效果
// $('.share_box ')

// 图片放大浏览功能
$('.con_left').on('click',function(ev) {
    var o = ev.target;
    if($(o.parentNode).hasClass('share_pic')) {
        var imgs = $(o).parents('.share_pic_box').find('img');
        var bigPic = imgs.map((k,v) => {
            return $(v).attr('src');
        });
        bigPic = new Big_pic(bigPic);
    }
});

// 在页面卸载时写入cookie记录用户此浏览状态
$(window).unload(function(){
    var str = JSON.stringify(share.userMsg);
    $.cookie('userMsg',str,{expires:1});
});


