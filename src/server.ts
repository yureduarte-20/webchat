import express, { json } from 'express';
import http from 'http'

import cors from 'cors'
import { Server, Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
export const app = express();

const server = http.createServer(app);
app.use(cors({ origin:'*' }));

export const io = new Server(server, { cors: { origin: '*' } });

app.use(json())
app.use(express.static('public'));

export const startServer = (port:number, callback?:() =>void) => server.listen(port, () => {
    console.log('Socker listen on ' + port);
    callback && callback()
})