import { defineStore } from "pinia";
import { socket } from "@/socket";
import { useAuth } from "./auth";

export const useConnectionStore = defineStore("connection", {
    state: () => ({
        isConnected: false,
    }),

    actions: {
        bindEvents() {
            socket.on("connect", () => {
                this.isConnected = true;
            });

            socket.on("disconnect", () => {
                this.isConnected = false;

            });
        },

        connect() {
            const auth = useAuth()
            socket.auth = { access_token: auth.token }
            socket.connect();
        }
    },
});