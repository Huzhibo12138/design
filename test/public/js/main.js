$(function () {
    const url = '127.0.0.1:80';

    var userName = null;
    var inputName = $('#name');
    var loginBtn = $('#loginbutton');
    var chetinput = $('#chetinput');

    var socket = io.connect(url);

    var setUserName = function() {
        userName = inputName.val().trim();

        if(userName) {
            socket.emit('login',{userName: userName});
        }
    };


    loginBtn.on('click',function(event) {
        setUserName();
    });

    inputName.on('keyup',function (event) {
        if(event.keyCode === 13){
            setUserName();
        }
    });

    socket.on('loginSuccess',function(data) {
        if(data.userName === data.userName) {
            beginChet(data);
        }else{
            alert('用户名不匹配，请重试');
        }
    });

    function beginChet(data) {
        $('#loginbox').hide('slow');
        inputName.off('keyup');
        loginBtn.off('click');

        $(`<p>欢迎你${userName}</p>`).insertBefore('#content');

        $('#chetbox').show('slow');
    }

    function sendMessage() {
        var message = chetinput.val();
        console.log(123);

        if(message) {
            socket.emit('sendMessage',{userName:userName,message:message});
        }
    }

    chetinput.on('keyup',function(event) {
        if(event.keyCode === 13) {
            sendMessage();
            chetinput.val('');
        }
    });

    socket.on('receiveMessage',(data) => {
        showMessage(data);
    });

    function showMessage(data) {
        if(data.userName === userName) {
            $('#contnt').append(`<p style='background: lightskyblue'><span>${data.userName} : </span> ${data.message}</p>`);
        }else{
            $("#content").append(`<p style='background: lightpink'><span>${data.username} : </span> ${data.message}</p>`);
        }
    }
});







