import { Server, Socket } from "socket.io";
import { IEventWrapper, IListener } from "../services/Publisher";
import { BINDING_KEY, EventManager } from "../services/EventManager";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { inject, injectionTarget } from "../core/DI";
import { ENTITY_MANAGER_BINDING_KEY, JWT_SERVICE_BINDING_KEY, SOCKET_IO_BINDING_KEY } from "../core/binding-keys";
import { JWTService } from "../services/JWTService";
import { EntityManager } from "typeorm";
import { Message } from "../entity/Message";
import { Contact } from "../entity";
@injectionTarget()
export default class ChatController implements IListener {
    private connections: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>[] = [];
    private messages: any[] = []
    constructor(
        @inject(SOCKET_IO_BINDING_KEY)
        private io?: Server,
        @inject(BINDING_KEY)
        private eventManager?: EventManager,
        @inject(JWT_SERVICE_BINDING_KEY)
        private jwtService?: JWTService,
        @inject(ENTITY_MANAGER_BINDING_KEY)
        private entityManager?: EntityManager
    ) {
        this.eventManager.subscribe({ listener: this, eventNameListener: 'connection' })
    }
    async update(name: string, socket?: any) {
        console.log('event name', name)
        if (socket && socket instanceof Socket) {
            console.log(socket.id)
            if (name == 'connection') {
                if (!socket.handshake.auth.access_token) {
                    socket.emit("error: no token provided", { message: "Você precisa estar autenticado para acessar este recurso" })
                    socket.disconnect()
                    console.log('Desconectado sem ter token')
                    return;
                }
                try {
                    const user = await this.jwtService.verifyToken(socket.handshake.auth.access_token)
                    socket.data.user = user
                    this.connections.push(socket)
                    this.bindingEvents(socket)
                } catch (e) {
                    socket.emit("error: token expired", { message: "Você precisa estar autenticado para acessar este recurso" })
                    socket.disconnect(true)
                }
            }
        }
    }
    disconnect(socket: Socket) {
        this.connections = this.connections.filter(s => s.id != socket.id)
        this.io.emit("user left", { message: `${socket.data.username} se desconectou`, username: socket.data.username })
    }
    receiveMessage(socket: Socket, msg: any) {
        this.messages.push({ ...msg, socketId: socket.id })
        this.io.emit('chat message', this.messages)
    }
    bindingEvents(socket: Socket) {
        socket.emit('hello', { message: 'Olá', socketId: socket.id })
        socket.on("disconnect", () => this.disconnect(socket));
        socket.on('chat message', (msg: any) => this.receiveMessage(socket, msg));
        socket.on('tell that i came', (msg: any) => this.handshakeBradcast(socket, msg))
        socket.on('message:create', ({ contactId, content, userID }, callback) => {
            console.log('criar mensagem')
            console.table({ contactId, content, userID })
            this.entityManager.getRepository(Contact)
                .findOne({
                    where:{
                        id: contactId
                    },
                    relations:{
                        user: true,
                        userDestination: true
                    }
                }).then(async contact => {
                    console.log(contact)
                    if (contact) {
                        this.entityManager.getRepository(Message)
                            .save({ contact, content, user: socket.data.user.id })
                            .then(message => {
                                callback && callback(message.id)
                                for (const connection of this.connections) {
                                    if (connection.data.user.id != userID &&  (contact.user.id == connection.data.user.id || contact.userDestination.id == connection.data.user.id ) ) {
                                        return connection.emit('message:created', { id: message.id, content: message.content, contactID: contact.id, userID: socket.data.user.id})
                                    }
                                }

                            })
                    }
                })
        })
        socket.on('message:find', ({ contactID }, callback) => {
            this.entityManager.getRepository(Message)
                .findBy({ contact: { id: contactID } })
                .then(d => callback && callback(d.map(message => ({ id: message.id, content: message.content, contactID: message.contact.id, userID: message.user.id }))))
                .catch(console.error)
        });
    }
    handshakeBradcast(socket: Socket, msg: any) {
        this.io.emit('new user', { username: msg.username, socketId: msg.socketId })
        this.connections = this.connections.map(_socket => {
            if (socket.id === _socket.id) {
                _socket.data = { username: msg.username }
            }
            return _socket
        })
    }
}