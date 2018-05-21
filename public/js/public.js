// 公共js文件
// 模态框的函数,封装为对象,通过new的方式运行,采用ES6,不考虑兼容
class Model{
    //添加静态方法与静态属性
    constructor({loadingMsg,title}) {
        this.str =
                    `<div class="model_bg">
                        <div class="model">
                            <div class="loading">
                                <p>${loadingMsg}</p>
                            </div>
                            <div class="alertMsg">
                                <h3>${title}<a class="glyphicon glyphicon-remove close" href="javascript:;"></a></h3>
                                <p class="alertMsgCon"></p>
                                <div class="btnBox">
                                    <button type="button" class="btn ok btn-success">确定</button>
                                    <button type="button" class="btn notOk btn-danger">取消</button>
                                </div>
                            </div>
                        </div>
                     </div>`;
        this.isNew = true;
    }
    // 显示模态框的方法
    show(alertMsgCon) {
        // 检查是否已经生成
        if(this.isNew) {
            $('body').append($(this.str));
            this.model = $('.model_bg');
            this.model.find('.close').click(() => {this.close ? this.close() : this.hide()});
            this.model.find('.ok').click(() => {this.ok ? this.ok() : this.hide()});
            this.model.find('.notOk').click(() => {this.notOk ? this.notOk() : this.hide()});
            this.isNew = false;
        }
        this.model.css('display','block');   // 显示出来
        if(!alertMsgCon) {   //若传入需要输出的信息,则显示,否则显示加载图片
            this.model.find('.alertMsg').css('display','none');
            this.model.find('.loading').css('display','block');
        }else{
            this.model.find('.loading').css('display','none');
            this.model.find('.alertMsg').fadeIn('slow').find('.alertMsgCon').text(alertMsgCon);
        }
    }
    // 隐藏模态框的方法
    hide() {
        this.model.css('display', 'none');
    }
    change(fnName,fn) {
        if(fnName == 'close' || fnName == 'ok' || fnName == 'notOk') {
            this[fnName] = fn;
        }else{
            return false;
        }
    }
    reChange() {
        this.close = this.hide;
        this.ok = this.hide;
        this.notOk = this.hide;
    }
}