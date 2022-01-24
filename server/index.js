const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io'); 
const { on } = require('events');

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET","POST"]
    }
})

io.on('connection', socket => {
    console.log(`User connected: ${socket.id}`);
    
    socket.on('join_room',(data)=>{
        socket.join(data);
        console.log(`User with id ${socket.id} joined room ${data}`)
    })

    socket.on('send_message', (data)=>{
        socket.to(data.room).emit('receive_message',(`${data.user} says: ${data.message} at ${data.time}Hr`))
    })

    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
});

const port = process.env.port || 3001;

server.listen(port , ()=>{
    console.log(`Server running in ${port}`)
})