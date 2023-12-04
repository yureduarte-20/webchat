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
import ContactRepository from "../repositories/ContactsRepository";
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
        private entityManager?: EntityManager,
        @inject("ContactRepository")
        private contactRepository?: ContactRepository
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
                    this.onConnected(socket)
                    this.bindingEvents(socket)
                } catch (e) {
                    socket.emit("error: token expired", { message: "Você precisa estar autenticado para acessar este recurso" })
                    socket.disconnect(true)
                }
            }
        }
    }

    async onConnected(socket: Socket) {
        const userId = socket.data.user.id;
        const contacts = await this.contactRepository.findOneByUserOrDestinationUser(userId)
        for (const con of this.connections) {
            if (con.data.user.id !== userId) {
                contacts.forEach(contact => {
                    if (contact.userDestination.id === con.data.user.id || contact.user.id === con.data.user.id) {
                        con.emit('user:online', { contactId: contact.id  })
                        socket.emit('user:online', { contactId: contact.id })
                    }
                })
            }
        }
    }

    async disconnect(socket: Socket) {
        const userId = socket.data.user.id
        this.connections = this.connections.filter(s => s.id != socket.id)
        const contacts = await this.contactRepository.findOneByUserOrDestinationUser(userId)
        for(const con of this.connections){
            if (con.data.user.id !== userId) {
                contacts.forEach(contact => {
                    if (contact.userDestination.id === con.data.user.id || contact.user.id === con.data.user.id) {
                        con.emit('user:offline', { contactId: contact.id  })
                    }
                })
            }
        }
    }
    bindingEvents(socket: Socket) {
        socket.on("disconnect", () => this.disconnect(socket));
        socket.on('message:create', ({ contactId, content, userId }, callback) => {
            console.log('criar mensagem')
            console.table({ contactId, content, userId })
            this.entityManager.getRepository(Contact)
                .findOne({
                    where: {
                        id: contactId
                    },
                    relations: {
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
                                    if (connection.data.user.id != userId && (contact.user.id == connection.data.user.id || contact.userDestination.id == connection.data.user.id)) {
                                        return connection.emit('message:created', { id: message.id, content: message.content, contactId: contact.id, userId: socket.data.user.id, createdAt: message.createdAt })
                                    }
                                }

                            })
                    }
                })
        })
        socket.on('message:find', ({ contactId }, callback) => {
            this.entityManager.getRepository(Message)
                .findBy({ contact: { id: contactId } })
                .then(d => callback && callback(d.map(message => ({ id: message.id, content: message.content, contactId: message.contact.id, userId: message.user.id, createdAt: message.createdAt }))))
                .catch(console.error)
        });
    }
}