<template>
    <div>
        <button @click="connect()">Connect</button>
        <button @click="disconnect()">Disconnect</button>
    </div>
</template>
  
<script setup lang="ts">
import { socket } from "../socket";
import { useAuth } from "../stores/auth";
const connect = () => {
    const auth = useAuth()
    socket.auth = { access_token: auth.token }
  socket.connect()
}
const disconnect = () => {
  socket.disconnect()
}
</script>