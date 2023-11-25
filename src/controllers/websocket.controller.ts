import { Server, Socket } from "socket.io";
import { IEventWrapper, IListener } from "../services/Publisher";
import { EventManager } from "../services/EventManager";

export default class ChatController implements IListener {
    constructor(
        private io: Server,
        private eventManager: EventManager
    ) {

    }
    update(name: string, data?: any): void {
        console.log('event nama', name)
        if(data && data instanceof Socket){
            console.log(data.id)
            data.emit('hello from socket', { message: 'Olá do socket' })
        }
        if (name == 'connection') {
            this.io.emit('hello', { message: 'olá' })
        }
    }

}