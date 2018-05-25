function conection(socket) {
    console.log('连接已建立');
    socket.emit('err','权限不够');
    socket.disconnect('close');
}


module.exports = conection;