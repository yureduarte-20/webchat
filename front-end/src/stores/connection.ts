import { defineStore } from "pinia";
import { socket } from "@/socket";
import { useAuth } from "./auth";
import { reactive, ref } from "vue";
import { notify } from "@kyvg/vue3-notification";

/* export const useConnectionStore = defineStore("connection", {
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
            socket.auth = { access_token: auth.token, token: auth.token }
            socket.connect();
        }
    },
}); */

export const useConnectionStore = defineStore("connection", () => {
    const isConnected = ref<boolean>(false)

    function bindEvents() {
        socket.on("connect", () => {
            isConnected.value = true;
        });

        socket.on("disconnect", () => {
            isConnected.value = false;
        });


        socket.on("error: no token provided", () => {
            notify({
                title: 'Error',
                text: 'Você não está autenticado',
                type: 'error'
            })
        })

    }
    function connect() {
        const auth = useAuth()
        if (auth.token) {
            socket.auth = { access_token: auth.token, token: auth.token }
            socket.connect();
        }
    }

    return {
        connect,
        bindEvents,
        isConnected
    }
})