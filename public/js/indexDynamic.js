// 此文件主要处理与服务器交互的逻辑
class Share{
    constructor() {
        this.initUserMsg();
        this.writerUserName();
        this.reqShareMsg();
    }
    // 初始化用户信息
    initUserMsg() {
        this.userMsg = $.cookie('userMsg');
        if(this.userMsg == "{}" || !this.userMsg) {
            this.userMsg = {
                _id:'nothing',
                page:0,
                newMsgIsOver:true,
                follow:[],
            }
        }else{
            this.userMsg = JSON.parse(this.userMsg);
        }
    }
    // 重置用户姓名,头像等信息
    writerUserName() {
        if(this.userMsg._id == 'nothing') {
            $('.headerUserName').text('新的游客');
            $('.owner_name').text('新的游客');
            $('.owner_pic').find('img').attr('src','../img/heart.jpg');
        }else{
            $('.headerUserName').text('我是' + this.userMsg.name);
            $('.owner_name').text(this.userMsg.name);
            $('.owner_pic').find('img').attr('src','../img/heart.jpg');
        }
    }
    // 生成文档的内容
    createMsg(msg) {
	    var conStr = `<div class="share_box" data="${msg.id}">
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
    // 请求新的动态
    reqShareMsg() {
        if(this.userMsg._id == 'nothing') {
            var url = 'index/getDefaultShareMsg';
        }else{
            var url = 'index/getFollowShareMsg';
        }
        $.ajax({
            url:url,
            type:'get',
            data:this.userMsg,
            success:this.handelShareMsg.bind(this),
            timeout:1000 * 15,  //15秒延迟
            beforeSend:()=>{model.show()},
            complete:(data) => {
                if(data.readyState === 0 || data.status !== 200) {
                    model.show('数据获取失败,请重试');
                    model.change('ok',() => {
                        this.reqShareMsg(this.userMsg);
                    });
                }
            },
        });
    }
    // 处理后台返回的动态信息
    handelShareMsg(data) {  //根据数据生成shareBox
        data = data || [];
        this.userMsg.newMsgIsOver = true;
        data.forEach( v => {
            var msg = {
                ownPic:'userImgs/' + v.headPic,
                ownName:v.name,
                time:v.time,
                con:v.con,
                talk:'123',
                good:'123',
                imgs:v.imgs,
                id:v.userId,
            }
            this.createMsg(msg);
        });
        model.hide();
    }
    reLoadPage() {
        $('.share_box').remove();
        this.writerUserName();
        this.reqShareMsg();
    }
    follow(user) {
        var followMsg = {
          user:this.userMsg._id,
          follow:user,
        };
        if(this.userMsg.follow.indexOf(followMsg.follow) !== -1) {
            model.show(`亲爱的${this.userMsg.name},该用户您已经关注过了!!!`);
            return false;
        }
        if(followMsg.user == 'nothing') {
            model.show('亲爱的游客,您还没有登录,是否登录??');
            model.change('ok',() => {
                $('.login_bg').css('display','block');
                model.hide();
            });
        }else{
            $.ajax({
                url:'follow',
                data:followMsg,
                beforeSend:model.show(),
                timeout:1000 * 10,
                complete:(data) => {
                    if(data.readyState === 0 || data.status !== 200) {
                        model.show('关注失败,请重试!!!');
                        model.change('ok',() => {
                            this.reqShareMsg(this.userMsg);
                        });
                    }
                },
                success:(data) => {
                    if(data.code == 0) {
                        model.show('关注成功!!!');
                        this.userMsg.follow.push(followMsg.follow);
                    }else{
                        model.show(data.err);
                    }
                },
            });
        }
    }
}






