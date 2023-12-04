import { defineStore } from "pinia";
import { socket } from "@/socket";
import { useAuth } from "./auth";
import { reactive, ref } from "vue";
export type Message = {
    id?: number;
    content: string;
    userId: number;
    contactId: number;
    createdAt?:string
}
const exampleMessage: Message = {
    content: "Hello, world!",
    userId: 2,
    contactId: 1
};


export const useMessagesStore = defineStore('messages', () => {
    const messages = ref<Message[]>([])
    const currentContact = ref<number>()

    function setCurrentContact(id: number) {
        currentContact.value = id
    } 

    function bindEvents() {
        // sync the list of items upon connection
        socket.on("connect", () => {

        });
        // update the store when an item was created
      /*   socket.on("message:created", (item) => {
            if (item.contactID == currentContact)
                messages.value.push(item)
        }); */
    }

    function onUserOnline(callback: (contactId: number) => void){
        socket.on('user:online', ({ contactId }) => {
            callback(contactId)
        })
    }

    function onUserOffline(callback: (contactId: number) => void){
        socket.on('user:offline', ({ contactId }) => {
            callback(contactId)
        })
    }

    function listMessageFrom(contactId: typeof exampleMessage.contactId, callback?: (messages: Message[]) => void) {
        socket.emit('message:find', { contactId }, (response: any) => {
            messages.value = response 
            callback && callback(response)
        })
    }
    function createMessage(message: Message, callback?:(msg:Message) => void) {
        socket.emit("message:create", message, (res: { data: number }) => {
            message.id = res.data;
            messages.value.push(message);
            callback && callback(message)
        });
    }
    function messageArrived(callback: (message: Message) => void){
        socket.on("message:created", msg =>{
            console.log(msg)
            if(msg.contactId == currentContact.value){
                messages.value.push(msg)
            }
            callback(msg)
        })
    }
    return {
        bindEvents,
        setCurrentContact,
        listMessageFrom,
        createMessage,
        messages,
        currentContact,
        messageArrived,
        onUserOffline,
        onUserOnline
    }
})