const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');

const server = app.listen(8000,()=> {
    console.log('Server connected');
});
const io = socket(server);
const messages = [];
const users =[];

io.on('connection', (socket) => {
    socket.on('message', (message) => {
        messages.push(message);
        socket.broadcast.emit('message', message);
    });
    socket.on('user',(userName)=> {
        users.push({id:socket.id, name:userName});
        socket.broadcast.emit('user', userName);
    })
    socket.on('disconnect', () => {
        const currentUser = users.find(user => user.id === socket.id);
        socket.broadcast.emit('userLeft', currentUser);
        const indexOfCurrentUser = users.indexOf(currentUser);
        users.splice(indexOfCurrentUser,1);
    });
});

app.use(express.static(path.join(__dirname,'/client')));

app.get('/',(req,res)=> {
    res.sendFile(path.join(__dirname,'/client/index.html'));
})
