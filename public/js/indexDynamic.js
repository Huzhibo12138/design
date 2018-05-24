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
            $('.headerUserName').text('我是:' + this.userMsg.name);
            $('.owner_name').text(this.userMsg.name);
            $('.owner_pic').find('img').attr('src',this.userMsg.headPic);
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
    	    var imgStr = `<div class="share_pic"><img src="${v}"></div>`;
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
    // 重新加载页面
    reLoadPage() {
        $('.share_box').remove();
        this.writerUserName();
        this.reqShareMsg();
    }
    // 关注用户
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
                url:'follow/addFollow',
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
    // 获得关注列表
    askFollowMsg() {
        if(this.userMsg._id == 'nothing') {
            return false;
        }else{
            var data = {
                _id:this.userMsg._id,
            }
            $.ajax({
                url:'follow/getFollow',
                data:data,
                beforeSend:model.show(),
                timeout:1000 * 10,
                complete:(data) => {
                    if(data.readyState === 0 || data.status !== 200) {
                        model.show('关注列表获取失败,请重试');
                        model.change('ok',() => {
                            this.askFollowMsg();
                        });
                    }
                },
                success:(data) => {
                    if(data.code == 0) {
                        this.createFollow(data.data);
                        model.hide();
                    }else{
                        model.show(data.err);
                    }
                },

            });
        }
    }
    // 创建关注列表
    createFollow(followMsg) {
        $('.my_follow_list>li').remove();
            followMsg.forEach(v => {
                var str = `<li data="${v._id}">
                               <img src="userImgs/${v.headPic}" alt="">
                               <p class="name">${v.name}</p>
                               <button>取消关注</button>
                           </li>`;
                $('.my_follow_list').append($(str));
        });
    }
    // 取消关注
    delFollow(user) {
        var followMsg = {
            user:this.userMsg._id,
            follow:user,
        };
        console.log(followMsg);
        $.ajax({
            url:'follow/delFollow',
            data:followMsg,
            beforeSend:model.show(),
            timeout:1000 * 30,
            complete:(data) => {
                if(data.readyState === 0 || data.status !== 200) {
                    model.show('取消关注失败,请重试!!!');
                    model.change('ok',() => {
                        this.delFollow(user);
                    });
                }
            },
            success:(data) => {
                if(data.code == 0) {
                    model.show('取消关注成功!!!');
                    this.askFollowMsg();
                }else{
                    model.show(data.err);
                }
            },
        });
    }
    // 获得我的动态
    getMyShare() {
        $.ajax({
            url:'index/getMyShare',
            data:this.userMsg,
            beforeSend:model.show(),
            timeout:1000 * 10,
            complete:(data) => {
                if(data.readyState === 0 || data.status !== 200) {
                    model.show('我的动态获取失败,请重试');
                    model.change('ok',() => {
                        this.getMyShare();
                    });
                }
            },
            success:(data) => {
                if(data.code == 0) {
                    model.hide();
                    $('.share_box').remove();
                    data.data.forEach(v => {
                        this.createMyShare(v);
                    });
                }else{
                    model.show(data.err);
                }
            },

        });
    }
    // 创建我的动态
    createMyShare(msg) {
        var conStr = `<div class="share_box" data="${msg.msgNum}">
            <div class="tit_box">
                <a href="javascript:;" class="user_pic">
                    <img src="${msg.headPic}" alt="">
                </a>
                <p class="user_name">${msg.ownName}</p>
                <button class="user_operate delete_share"><i class="glyphicon glyphicon-remove"></i>删除</button>
                <p class="user_msg">${msg.time}</p>
            </div>
            <div class="share_box_con">
                <p class="share_article">${msg.con}</p>
                <div class="share_pic_box">
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
            var imgStr = `<div class="share_pic"><img src="${v}"></div>`;
            share_pic_box.append($(imgStr));
        });
        $('.con_left').append(shareBox);
    }
    // 删除我的动态
    deleteMsg(msgNum,share) {
        var data = {
            _id:this.userMsg._id,
            msgNum:msgNum,
        };
        $.ajax({
            url:'index/deleteMyShare',
            data:data,
            beforeSend:model.show(),
            timeout:1000 * 10,
            complete:(data) => {
                if(data.readyState === 0 || data.status !== 200) {
                    model.show('删除失败,请重试');
                    model.change('ok',() => {
                        this.deleteMsg(msgNum);
                    });
                }
            },
            success:(data) => {
                if(data.code == 0) {
                    model.show('动态删除成功');
                    share.remove();
                }else{
                    model.show(data.err);
                }
            },

        });
    }
}


class Big_pic{
    constructor(pics) {
        this.index = 0;
        this.create(pics);
        this.pics = pics;
    }
    create(pics) {
        var str = ` <div class="big_share_pic_bg">
                        <a href="javascript:;" class="glyphicon glyphicon-remove big_share_close"></a>
                        <div class="big_pic">
                            <a href="javascript:;" class="left">
                                <i class="glyphicon glyphicon-chevron-left"></i>
                            </a>
                            <a href="javascript:;" class="right">
                                <i class="glyphicon glyphicon-chevron-right"></i>
                            </a>
                            <img src='${pics[0]}' alt="">
                        </div>
                        <div class="sml_pic">
                            <ul></ul>
                        </div>
                    </div>`;
        this.oBigPicAll = $(str);
        this.bigPic = this.oBigPicAll.find('.big_pic img');
        pics.each((k,v) => {
            var str = `<li class="sml_Pic">
                            <img src='${v}' alt="">
                        </li>`;
            this.oBigPicAll.find('.sml_pic>ul').append($(str));
        });
        $('body').append(this.oBigPicAll);
        this.smlPic = this.oBigPicAll.find('.sml_pic li');
        $( this.smlPic[0]).addClass('active');
        this.oBigPicAll.css('display','block');
        this.oBigPicAll.find('.left').on('click',this.moveLeft.bind(this));
        this.oBigPicAll.find('.right').on('click',this.moveRight.bind(this));
        $( this.smlPic).on('click',this.clickPic.bind(this));
        this.oBigPicAll.find('.big_share_close').on('click',this.close.bind(this));
    }
    moveLeft() {
        this.index--;
        if(this.index < 0) {
            this.index = this.pics.length - 1;
        }
        this.changeActive(this.index);
    }
    moveRight() {
        this.index++;
        if(this.index >= this.pics.length) {
            this.index = 0;
        }
        this.changeActive(this.index);
    }
    clickPic(ev) {
        var o = ev.target.parentNode;
        this.index = $( this.smlPic).index(o);
        this.changeActive(this.index);
    }
    changeActive(index) {
        $( this.smlPic).removeClass('active');
        $( this.smlPic).eq(index).addClass('active');
        this.bigPic.attr('src',this.pics[index]);
    }
    close() {
        $('.big_share_pic_bg').remove();
        // this = null;
    }
}



