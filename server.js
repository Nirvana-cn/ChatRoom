var express=require('express')
var fs=require('fs')
var app=express()
var userNames=[]
app.get('/',function (req, res) {
    fs.readFile('./index.html',function (error,data) {
        res.writeHead(200,{'Content-Type':'text/html'})
        res.end(data,'utf-8')
    })
})
var server=app.listen(3002,function () {
    console.log('Server is listening at http://localhost:3002')
})
var io=require('socket.io').listen(server)
io.sockets.on('connection',function (socket) {
    socket.emit('welcome',userNames)
    socket.on('name',function (data,callback) {
        // console.log(`Server received the following name : ${data.userName}`)
        if(userNames.indexOf(data.userName)!== -1){
            callback(false)
        }else{
            callback(true)
            userNames.push(data.userName)
            socket.userName=data.userName
            io.sockets.emit('userNames',userNames)
        }
    });
    socket.on('message',function (data) {
        // console.log(`Receive message from ${data.userName}:${data.userMessage}`)
        socket.broadcast.emit('receiveMessage',{
            userName:data.userName,
            userMessage:data.userMessage
        })
    })
    socket.on('disconnect',function () {
        if(!socket.userName) return;
        if(userNames.indexOf(socket.userName)>-1){
            userNames.splice(userNames.indexOf(socket.userName),1)
            // console.log(userNames)
        }
        socket.broadcast.emit('userNames',userNames)
    })
});