import { defineStore } from "pinia";
import { socket } from "@/socket";
import { useAuth } from "./auth";
export type Message = {
    id?: number;
    fromId: number;
    content: string;
    toId: number;
}
const exampleMessage: Message = {
    fromId: 1,
    content: "Hello, world!",
    toId: 2,
};

export const useMessagesStore = defineStore("item", {
    state: () => ({
        messages: [] as Message[],
        currentUserId: 0
    }),
    actions: {
        setCurrentUser(id: number) {
            this.currentUserId = id
        },

        bindEvents() {
            // sync the list of items upon connection
            socket.on("connect", () => {

            });
            // update the store when an item was created
            socket.on("message:created", (item) => {
                if (item.from == this.currentUserId)
                    this.messages.push(item);
                console.log(item)
            });
        },
        listMessageFrom(from: typeof exampleMessage.fromId) {
            socket.emit('message:find', { from }, (response: any) => {
                console.log(response)
                this.messages = response
            })
        },
        createMessage(message: Message) {
            message.id = Date.now()
            this.messages.push(message);
            socket.emit("message:create", { message }, (res: { data: number }) => {
                message.id = res.data;
            });
        },
    },
});
