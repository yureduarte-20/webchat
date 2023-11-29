import { defineStore } from "pinia";
import { socket } from "@/socket";
import { useAuth } from "./auth";
export type Message = {
    id?: number;
    fromId: number;
    message: string;
    toId: number;
}
const exampleMessage: Message = {
    fromId: 1,
    message: "Hello, world!",
    toId: 2,
  };
  
export const useMessagesStore = defineStore("item", {
    state: () => ({
        items: [] as Message[],
    }),
    actions: {
        bindEvents() {
            // sync the list of items upon connection
            socket.on("connect", () => {
                socket.emit("message:list", (res :{ data: Message[] }) => {
                    this.items = res.data;
                });
            });
            // update the store when an item was created
            socket.on("message:created", (item: Message) => {
                this.items.push(item);
            });
        },
        listMessageFrom(from:  typeof exampleMessage.fromId){
            socket.emit('message:find', {  from  })
        },
        createMessage(message: Message) {
            message.id = Date.now()
            this.items.push(message);
            socket.emit("item:create", { message }, (res:{ data: number }) => {
                message.id = res.data;
            });
        },
    },
});
