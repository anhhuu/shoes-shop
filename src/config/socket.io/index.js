const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log("An user connected ");

    socket.on("join-room",(roomName)=>{
        socket.join(roomName);
    })

    socket.on('disconnect', () => {
    });

    socket.on('comments', (comment) => {
        io.emit(`comments/${comment.productID}`,comment);
        console.log(comment);
    });

});

module.exports = {
    app,
    http,
    io,
    express
}


