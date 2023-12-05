<script setup lang="ts">

import { useNotification } from '@kyvg/vue3-notification';
import { isAxiosError } from 'axios';
import { reactive } from 'vue';
import { useRouter } from 'vue-router'
import api from '../services/api';
import { useAuth } from '../stores/auth';
const auth = useAuth()
const router = useRouter()

const errors = reactive({ has: false, message: '' });
const { notify } = useNotification()
const showErrorMessage = (msg: string, time = 3000) => {
  notify({
    title: 'Error',
    text: msg,
    type: 'error'
  })
}

const login = async (e: any) => {
  const body: any = {};
  for (const input of e.target) {
    if (input.type != 'submit') { 
      body[input.name] = input.value
    }
  }
  try {
    const { data } = await api.post('/login', body)
    auth.setToken(data.access_token)

    const { data: profile } = await api.get('/profile', {
      headers: {
        Authorization: `Bearer ${data.access_token}`
      }
    })
    auth.setUser(profile)
    router.push({ name: 'chat' })
  } catch (e) {
    if (isAxiosError(e)) {
      if (e.response) {
        showErrorMessage(e.response.data.message)
        return
      }
    }
    return alert('Não foi possível concluir a operação')
  }
}
</script>
<template>
    <div class="container">
        <div class="row justify-content-center align-items-center min-vh-100" >
            <div class="col-6">
                <div class="card">
                    <div class="card-body">
                        <form @submit.prevent="login" class="form_login mb-3">
                            <h5 class="card-title">Login</h5>
                            <p class="card-text">Entre com o email para entrar na conversa.</p>
                            <div class="input-group mb-3">
                                <input required class="form-control" name="email" id="username" placeholder="Email..." />
                            </div>
                            <div class="input-group mb-1">
                                <input required class="form-control" type="password" name="password" id="password" placeholder="Senha..." />
                            </div>
                            <button class="btn btn-primary w-100">Entrar</button>
                        </form>
                        <div class="card-footer">
                            <span>Não possui um cadastro? então clique <router-link to="signup">aqui.</router-link></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>

</style>
