import express from 'express';
import http from 'http'
import cors from 'cors'
import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
const app = express();
const port = 3000;
const server = http.createServer(app);
app.use(cors({ origin:'*' }));
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.static('public'));
let connections: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>[] = []

server.listen(port, () => {
    console.log('Socker listen on ' + port);
})
app.get('/users', (req, res) =>{
    const users = connections.map( socket => {
        return socket.data.username;
    })
    return res.json({ users })
})
io.on('connection', (socket) => {
    
    connections.push(socket)
    socket.on("disconnect", () => {
        connections = connections.filter(s => s.id != socket.id)
        io.emit("user left", { message:`${socket.data.username} se desconectou`, username:socket.data.username })
    });
    socket.on('chat message', (msg) => {
        console.log(msg);
        io.emit('chat message', { ...msg, socketId: socket.id })
    });
    socket.emit('hello', { message: 'Olá', socketId: socket.id })
    socket.on('tell that i came', msg => {
        io.emit('new user', { username: msg.username, socketId: msg.socketId })
        connections = connections.map(_socket => {
            if (socket.id === _socket.id) {
                _socket.data = { username: msg.username }
            }
            return _socket
        })
    })
});