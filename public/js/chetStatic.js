window.onload = function() {
    // 静态聊天页面的js文件,主要处理交互功能

    // 获取需要的元素
    var oFooter = $('footer');
    var oContent = $('content');
    var oConRight = $('con_right');

    // 1.总体页面的功能
    // 1.1取消右键菜单
    document.oncontextmenu = function (ev) {
        var e = ev || window.event;
        var o = e.target || e.srcElement;
        console.log(o);
        return false;
    }

    // 1.2取消拖蓝效果
    document.onselectstart = function () {
        return false;
    }

    // 1.3背景轮播效果
    // 1.3.1计算背景大小的函数
    calBgSize();

    function calBgSize() {
        var oBgPic = $('bgPicList').children;
        var width = document.documentElement.clientWidth;
        var height = document.documentElement.clientHeight;
        for (var i = 0; i < oBgPic.length; i++) {
            oBgPic[i].style.width = width + 'px';
            oBgPic[i].style.height = height + 'px';
        }
    };
    addEvent(window, 'resize', calBgSize);

    // 1.3.2轮播图效果
    function banner() {
        // var
    }


    // 2.左边列表的功能
    // 2.1.点击底部的按钮切换显示列表
    oFooter.onclick = function (ev) {
        var e = ev || window.event;
        var o = ev.target || e.srcElement;
        // 清除按钮的选中效果
        for (var i = 0; i < oFooter.children.length; i++) {
            oFooter.children[i].className = '';
        }
        // 添加按钮选中效果,清除列表的显示效果,添加列表显示效果
        if (o.tagName === 'I' || o.tagName === 'SPAN') {
            o.parentNode.className = 'footer_onfocus';
            var sTag = o.parentNode.getAttribute('title');
            for (var i = 0; i < oContent.children.length; i++) {
                oContent.children[i].style.display = 'none';
                if (oContent.children[i].className === sTag) {
                    oContent.children[i].style.display = 'block';
                }
            }
        }
    }
    // 2.2 朋友列表点击展开与隐藏
    var oContactsCon = $('contacts_con');
    addEvent(oContactsCon, 'click', function (ev) {
        var e = ev || window.event;
        var o = ev.target || e.srcElement;
        if (o.tagName === 'LI' && o.title === '点击展开列表') {
            o.parentNode.style.height = 'auto';
            o.setAttribute('title', '点击收起列表');
            o.children[0].setAttribute('class', 'iconfont icon-iconfontjiantou');
        } else if (o.tagName === 'LI' && o.title === '点击收起列表') {
            o.parentNode.style.height = '39px';
            o.setAttribute('title', '点击展开列表');
            o.children[0].setAttribute('class', 'iconfont icon-jiantou');
        }
        // 滚动条的变化
        scrollBarCaculate(oContactsCon, oContactsCon.children[0], oContactsCon.children[1]);
    });
    // 2.3 朋友页面动态展开
    var oConLeft = $('con_left');
    move(oConLeft, {width: [280, 15, 'linear']}, function () {
        move(oConLeft, {height: [615, 10, 'buffer']});
    });
    $('close').onclick = function () {
        move(oConLeft, {height: [45, 30, 'linear']}, function () {
            move(oConLeft, {width: [0, 40, 'linear']});
        });
    }


    // 3.右边聊天框的总体功能
    // oConRight.style.display = 'block';
    // 3.1点击按钮关闭聊天框功能
    $('con_right_close').onclick = function () {
        oConRight.style.display = 'none';
    }
    // 3.2显示隐藏朋友信息的功能
    // var oFirendInfo = $('firend_info');
    // $('con_right_tit_more').onclick = function() {
    // 	if(this.title == '显示信息') {
    // 		oFirendInfo.style.height = '100px';
    // 		this.setAttribute('title','隐藏信息');
    // 	}else{
    // 		oFirendInfo.style.height = '0px';
    // 		this.setAttribute('title','显示信息');
    // 	}
    // }

    // 4.左右联动,点击左边联系人,显示右边的聊天框
    var oLi = document.getElementsByTagName('li');
    // console.log();
    for (var i = 0; i < oLi.length; i++) {
        addEvent(oLi[i], 'dblclick', function (ev) {
            if (this.title === '双击开始聊天') {
                oConRight.style.display = 'block';
                openChetBox(this);
            }
        });
    }


    // 定义一个函数,打开右边的聊天列表,并为其赋值
    function openChetBox(li) {
        var msg = JSON.parse(li.getAttribute('msg'));
        console.log(msg);
        $('con_right_tit_name').innerHTML = msg.name;
        document.msgSend.owner.value = msg.id;
        document.msgSend.receiver.value = msg.id;
    }

    // 自定义滚动条
    var scrollParent1 = $('chet_list');
    scrollBarMain(scrollParent1, scrollParent1.children[0], scrollParent1.children[1], 100);
    var scrollParent2 = $('contacts_con');
    scrollBarMain(scrollParent2, scrollParent2.children[0], scrollParent2.children[1], 100)

}