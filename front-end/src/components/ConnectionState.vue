<template>
    <p>State: {{ connected }}</p>
</template>
<script setup lang="ts">
    import { computed } from 'vue';
    import { state } from "./../socket";
    const connected = computed(() => state.connected)
</script>