<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useMessagesStore } from "@/stores/messages";
import { useConnectionStore } from "@/stores/connection";
import { socket } from "@/socket";

const itemStore = useMessagesStore();
const connectionStore = useConnectionStore();

// remove any existing listeners (after a hot module replacement)
socket.off();

itemStore.bindEvents();
connectionStore.bindEvents();
</script>

<template>

   <RouterView />
   <notifications />

</template>

<style scoped>

</style>
