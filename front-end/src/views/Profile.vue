<script setup lang="ts">
import { notify } from "@kyvg/vue3-notification";
import { isAxiosError } from "axios";
import { computed,onMounted,ref } from "vue";
import api from "../services/api";
import { useAuth } from "../stores/auth";
import router from "@/router";
import Navbar from "@/components/Navbar.vue";
const user= useAuth().user
const jwtToken=  useAuth().token
const name=ref<string>('')
const password=ref('')
const confirmPassword=ref<string>('')

const changeName=() => {
  api.patch('/users/'+user.id,{ name: name.value },{ headers: { Authorization: `Bearer ${jwtToken}` } })
    .then(d => {
      notify({
        title: 'Sucesso!',
        type: 'success',
        text: 'Seu perfil foi atualizado com sucesso'
      })
      router.back()
    })
    .catch(e => {
      if(isAxiosError(e)&&e.response?.data.message) {
        return notify({
          title: 'Erro',
          text: e.response?.data.message,
          type: 'error'
        })
      }
      return notify({
        title: 'Erro',
        text: 'Não foi possível atualizar seus dados',
        type: 'error'
      })
    })
}

const changePassword=() => {
  console.log('aquii')
  if(password.value!==confirmPassword.value) {
    return notify({
      title: 'Incorreto',
      text: 'as senhas precisam ser as coicidem',
      type: 'error',
    })
  }
  api.patch('/users/password',{ password: password.value, confirmPassword: confirmPassword.value }, { headers:{ Authorization: `Bearer ${jwtToken}` } })
    .then(({ data }) => {
      notify({
        title: 'Sucesso!',
        type: 'success',
        text: 'Senha atualizada com sucesso'
      })
      router.back()
    })
    .catch(e => {
      if(isAxiosError(e)&&e.response?.data.message) {
        return notify({
          title: 'Erro',
          text: e.response?.data.message,
          type: 'error'
        })
      }
      return notify({
        title: 'Erro',
        text: 'Não foi possível atualizar sua senha',
        type: 'error'
      })
    })
}

onMounted(() => {
  api.get(`/profile`,{ headers: { Authorization: `Bearer ${jwtToken}` } })
    .then(({ data }) => {
      name.value=data.name
    })
    .catch(e => {
      if(isAxiosError(e)&&e.response?.data.message) {
        return notify({
          type: 'error',
          text: e.response?.data.message,
          title: 'Erro'
        })
      }
      notify({
        text: 'Não foi possível recuperar as informações de seu perfil',
        title: 'Erro',
        type: 'error'
      })
    })
})
</script>
<template>
    <Navbar>
        <div class="container">
            <div class="row justify-center align-center mb-3">
                <div class="col-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Atualização cadastral</h5>
                            <div class="mb-3">
                                <label class="form-label" for="password">Nome</label>
                                <input v-model="name" class="form-control" name="name" />
                            </div>
                            <button @click.prevent="changeName" class="btn btn-primary">Alterar nome</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row justify-content align-center mb-3">
                <dib class="col-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Atualização de senha</h5>
                            <form @submit.prevent="changePassword">
                                <div class="mb-3">
                                    <label class="form-label" for="password">Senha</label>
                                    <input v-model="password" class="form-control" name="password" />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label" for="confirmPassword">Senha</label>
                                    <input v-model="confirmPassword" class="form-control" name="confirmPassword" />
                                </div>
                                <button @click.prevent="changePassword" class="btn btn-primary">Atualizar senha</button>
                            </form>
                        </div>
                    </div>
                </dib>
            </div>
        </div>
    </Navbar>
</template>