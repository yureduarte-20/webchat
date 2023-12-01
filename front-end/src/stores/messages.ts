import { defineStore } from "pinia";
import { socket } from "@/socket";
import { useAuth } from "./auth";
import { reactive, ref } from "vue";
export type Message = {
    id?: number;
    content: string;
    userID: number;
    contactId: number;
}
const exampleMessage: Message = {
    content: "Hello, world!",
    userID: 2,
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

    function listMessageFrom(contactID: typeof exampleMessage.contactId, callback?: (messages: Message[]) => void) {
        socket.emit('message:find', { contactID }, (response: any) => {
            messages.value = response 
        })
    }
    function createMessage(message: Message) {
        socket.emit("message:create", message, (res: { data: number }) => {
            message.id = res.data;
            messages.value.push(message);
        });
    }

    return {
        bindEvents,
        setCurrentContact,
        listMessageFrom,
        createMessage,
        messages,
        currentContact,
    }
})