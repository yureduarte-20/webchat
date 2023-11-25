import express from 'express';
import http from 'http'
import "reflect-metadata"
import cors from 'cors'
import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
export const app = express();

const server = http.createServer(app);
app.use(cors({ origin:'*' }));

export const io = new Server(server, { cors: { origin: '*' } });

app.use(express.static('public'));
let connections: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>[] = []


/* app.get('/users', (req, res) =>{
    const users = connections.map( socket => {
        return socket.data.username;
    })
    return res.json({ users })
}) */

/* io.on('connection', (socket) => {
    
    connections.push(socket)
    console.log('cc')
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
}); */
export const startServer = (port:number, callback?:() =>void) => server.listen(port, () => {
    console.log('Socker listen on ' + port);
    callback && callback()
})