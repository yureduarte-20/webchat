import express from 'express';
import http from 'http'
const app = express();
const port = 3000;
const server = http.createServer(app);
import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
const io = new Server(server, { cors: { origin: '*' } });
app.use(express.static('public'));
let connections: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>[] = []


server.listen(port, () => {
    console.log('Socker listen on ' + port);
})
io.on('connection', (socket) => {
    connections.push(socket);
    socket.on("disconnect", () => {
        connections = connections.filter(s => s.id != socket.id)
        console.log("disconecting", socket.id)
    });
    socket.on('chat message', (msg) => {
        console.log( msg);
        io.emit('chat message', msg)
    });
    
});