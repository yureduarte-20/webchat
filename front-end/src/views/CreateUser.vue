<script setup lang="ts">
import router from '@/router';
import api from '@/services/api';
import { useAuth } from '@/stores/auth';
import { notify } from '@kyvg/vue3-notification';
import { isAxiosError } from 'axios';
import { reactive } from 'vue';
const auth = useAuth()
const error = reactive({ has: false, message: '' })
const showMessage = (msg:string, time = 3000)=>{
    notify({
        title: 'Error',
        text: msg
    })
}
const submit = (e: any) => {
    const body: any = {}
    for (const input of e.target) {
        if (input.type !== 'submit') {
            body[input.name] = input.value
        }
    }
    if (body.password !== body.confirmPassword) {
        showMessage('A senha precisa ser a mesma que confirmar senha')
        return
    }
    api.post("/users", body)
        .then(() => router.replace('login'))
        .catch(e => {
            if (isAxiosError(e)) {
                if (e.response) {
                    if (e.response.data.message) {
                       showMessage(e.response.data.message)
                       return
                    }
                }
            }
            showMessage('Não foi possível concluir a operação')
        })

}

</script>
<template>
    <div class="container">
        <div v-if="error.has" class="alert alert-danger" role="alert">
            {{ error.message }}
        </div>
        <div class="row justify-content-center align-items-center min-vh-100">
            <div class="col-lg-8 col-md-10 col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Cadastrar novo usuário</h5> 
                        <form @submit.prevent="submit" id="registerForm">
                            <div class="input-group mb-3">
                                <span class="input-group-text">Nome e sobrenome</span>
                                <input type="text" name="name" aria-label="First name" class="form-control">
                               
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="basic-addon1">Email</span>
                                <input name="email" type="email" required class="form-control">
                            </div>
                            <div class="input-group mb-3">
                                <label for="password" class="input-group-text">Senha e confirmar senha</label>
                                <input name="password" type="password" class="form-control">
                                <input name="confirmPassword" type="password" class="form-control">
                            </div>
                            <button class="btn btn-primary" type="submit">Enviar</button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>