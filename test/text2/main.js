$(function () {
    const url = '127.0.0.1:8080';

    var socket = io.connect(url);

    $('button').on('click',function() {
        socket.emit('aaa','你好');
    });

    socket.on('connection',() => {
        console.log('连接已建立');
    });
    socket.on('bbb',(data) => {
        console.log(data);
    });
});







