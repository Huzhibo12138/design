var model = new Model({loadingMsg:'正在拼命加载,请稍等!!!',
    title:'欢迎访问本网站',
});

$('.choose').on('click',function() {
	$('.pic').trigger('click');
});


$('.pic').on('change',function() {
    createPic(this.files[0]);
});

function createPic(file) {
    var url = getObjectURL(file);
    $('.headPic').css('display','block').attr('src',url);
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

$('.submit').on('click',function() {
	if($('.pic').val() == '') {
		model.show('请选择一张图片');
	}
	else{
		var sex = $('.sex').val();
		if(sex == 1) {
			model.show('您选择的性别是"男",是否补完信息?');
			model.change('ok',() => {
				supply();
			});
		}else if(sex == 2) {
			model.show('您选择的性别是"女",是否补完信息?');
			model.change('ok',() => {
				supply();
			});
		}else{
			model.show('请选择您的性别');
		}
	}
});


function supply() {
	var user = JSON.parse($.cookie('userMsg'));
	if(user.name == 'nothing') {
		model.show('亲爱的游客,您还没有登录,请登录后再试!!!');
		model.change('ok',() => {
			window.location.href = 'index.html';
		});
	}else{
		var formFile = new FormData();
		formFile.append('file',$('.pic')[0].files[0]);
		var str =`id=${user._id}&sex=${$('.sex').val()}`;
		$.ajax({
        url:'/supply?' + str,
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
                model.show('补完信息失败,请重试!!!');
                model.change('ok',() => {
                	supply();
                });
            }
        },
        success:(data) => {
            if(data.code == 0) {
                model.show('补完信息成功,请退出并重新登录!!!');
                model.change('ok',() => {
                	window.location.href = 'index.html';
                });
            }else{
                model.show(data.err);
            }
        },
    });
	}
}