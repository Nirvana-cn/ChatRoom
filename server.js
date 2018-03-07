var express=require('express');
var fs=require('fs');
var app=express();
var userNames=[];
app.get('/',function (req, res) {
    fs.readFile('./index.html',function (error,data) {
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end(data,'utf-8')
    })
});
var server=app.listen(3000,function () {
    console.log('Server is listening at http://127.0.0.1')
});
var io=require('socket.io').listen(server);
io.sockets.on('connection',function (socket) {
    socket.emit('welcome',{text:'Welcome'});
    socket.on('name',function (data) {
        console.log(`Server received the following name : ${data.userName}`)
        userNames.push(data.userName);
        socket.userName=data.userName;
    });
    socket.on('disconnect',function () {
        if(!socket.userName) return;
        if(userNames.indexOf(socket.userName)>-1){
            userNames.splice(userNames.indexOf(socket.userName),1);
            console.log(userNames);
        }
    })
});