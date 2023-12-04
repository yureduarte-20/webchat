<script setup lang="ts">
import { defineComponent } from "vue";

</script>
<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Web chat</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link to="chat" class="nav-link active" aria-current="page">Chat</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="profile" class="nav-link" tabindex="-1">Perfil</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <slot />
</template>