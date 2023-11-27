import { Server, Socket } from "socket.io";
import { IEventWrapper, IListener } from "../services/Publisher";
import { BINDING_KEY, EventManager } from "../services/EventManager";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { inject, injectionTarget } from "../core/DI";
import { JWT_SERVICE_BINDING_KEY, SOCKET_IO_BINDING_KEY } from "../core/binding-keys";
import { JWTService } from "../services/JWTService";
@injectionTarget()
export default class ChatController implements IListener {
    private connections: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>[] = [];
    private messages:any[] = []
    constructor(
        @inject(SOCKET_IO_BINDING_KEY)
        private io?: Server,
        @inject(BINDING_KEY)
        private eventManager?: EventManager,
        @inject(JWT_SERVICE_BINDING_KEY)
        private jwtService?: JWTService
    ) {
        this.eventManager.subscribe({ listener: this, eventNameListener: 'connection' })
    }
    update(name: string, socket?: any): void {
        console.log('event nama', name)
        if (socket && socket instanceof Socket) {
            console.log(socket.id)
            if (name == 'connection') {
                if(!socket.handshake.auth.access_token){
                    socket.emit("error: no token provided", { message: "Você precisa estar autenticado para acessar este recurso" })
                    socket.disconnect(true)  
                }
                this.connections.push(socket)
                socket.emit('hello', { message: 'Olá', socketId: socket.id })
                socket.on("disconnect", () => this.disconnect(socket));
                socket.on('chat message', (msg: any) => this.receiveMessage(socket, msg));
                socket.on('tell that i came', (msg:any) => this.handshakeBradcast(socket, msg))
            }
        }
    }
    disconnect(socket: Socket) {
        this.connections = this.connections.filter(s => s.id != socket.id)
        this.io.emit("user left", { message: `${socket.data.username} se desconectou`, username: socket.data.username })
    }
    receiveMessage(socket:Socket, msg:any) {
        this.messages.push({...msg, socketId: socket.id})
        this.io.emit('chat message', this.messages)
    }
    handshakeBradcast(socket:Socket, msg: any) {
        this.io.emit('new user', { username: msg.username, socketId: msg.socketId })
        this.connections = this.connections.map(_socket => {
            if (socket.id === _socket.id) {
                _socket.data = { username: msg.username }
            }
            return _socket
        })
    }
}