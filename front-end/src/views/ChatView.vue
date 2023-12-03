<script setup lang="ts">
import router from '@/router';
import api from '@/services/api';
import { useAuth } from '@/stores/auth';
import { useConnectionStore } from '@/stores/connection';
import { useMessagesStore, type Message } from '@/stores/messages';
import { useNotification } from '@kyvg/vue3-notification';
import { isAxiosError } from 'axios';
import ModalContact from '@/components/ModalContactSearch.vue'
import { storeToRefs } from 'pinia';
import { nextTick, onMounted, ref, watch, getCurrentInstance, toRef } from 'vue';

const { token, user } = useAuth()
const contacts = ref<any[]>([])
const { notify } = useNotification()
const msgHistory = ref()
const selectedContact = ref<any>(null)
const connectionStore = (useConnectionStore())
const messageStore = useMessagesStore()
const { currentContact, messages } = storeToRefs(messageStore)
const searchString = ref<string>('');
const typed_message = ref<string>('')
const modalVisible = ref<boolean>(false)

watch(selectedContact, async () => {
  if (!connectionStore.isConnected) connectionStore.connect()

  if (selectedContact.value) {
    messageStore.listMessageFrom(selectedContact.value.id as number, () => scrollToEnd())
    messageStore.setCurrentContact(selectedContact.value.id)
  }
})
messageStore.messageArrived(msg => {
  if (currentContact.value === msg.contactId) {
    scrollToEnd()
  }
  contacts.value.forEach(c => {
    if (c.id == msg.contactId) {
      c.latestMessage = { ...msg }
    }
  })
})

const scrollToEnd = () => {
  if (msgHistory.value) {
    console.log(msgHistory)
    nextTick(() => {
      msgHistory.value.scrollTop = msgHistory.value.scrollHeight + 20
    })
  }
}

const extractUser = (contact: any) => {
  if (contact.userDestination.id == user.id) {
    return contact.user;
  } else {
    return contact.userDestination
  }
}
const sendMessage = () => {
  if (currentContact.value) {
    messageStore.createMessage(<Message>{ contactId: currentContact.value, content: typed_message.value, userId: user.id }, msg => {
      contacts.value.forEach(c => {
        if (c.id == msg.contactId) {
          c.latestMessage = msg
        }
      })
      scrollToEnd()
    })
    typed_message.value = ''
  }
  typed_message.value = ''
}
const createContact = (contactEmail: string) => {
  api.post('/contacts',
    {
      contactEmail
    },
    {
      headers: {
        Authorization: `Bearer ${useAuth().token}`
      }
    })
    .then(({ data }) => { selectedContact.value = data.id; contacts.value.push(data) })
    .catch(e => {
      if (isAxiosError(e)) {
        if (e.response?.data.message) {
          return notify({
            title: 'Error',
            text: e.response?.data.message
          })
        }
      }
      notify({
        title: 'Erro',
        text: 'Não foi possível completar esta operação'
      })
    })
}
onMounted(() => {
  if (!connectionStore.isConnected) connectionStore.connect()
  if (getCurrentInstance()?.refs.msgHistory) {
    msgHistory.value = getCurrentInstance()?.refs.msgHistory
  }
})
onMounted(() => {
  api.get('/contacts', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(async ({ data }) => {
      contacts.value = data;


    })
    .catch(e => {
      if (isAxiosError(e)) {
        if (e.response && e.response.data.message) {
          return notify({
            title: 'Erro',
            text: e.response.data.message,
            type: 'error'
          })
        }
      }
      notify({
        title: 'Erro',
        text: 'Não foi possível recuperar seus contatos',
        type: 'error'
      })
    })
})


</script>
<template>
  <div class="container">
    <ModalContact title="Pesquisar usuários" @update:cancel-request="modalVisible = false" :visible="modalVisible"
      @update:on-choose="v => createContact(v)" />
    {{ connectionStore.isConnected ? "Online" : "Offline" }}
    <h3 class=" text-center">Messaging</h3>
    <div class="messaging">
      <div class="inbox_msg">
        <div class="inbox_people">
          <div class="headind_srch">
            <div class="recent_heading">
              <h4>Recent</h4>
            </div>
            <div class="srch_bar">
              <div class="stylish-input-group">
                <span type="text" @click.prevent="modalVisible = !modalVisible" class="search-bar"
                  placeholder="Search">Pesquisar</span>
              </div>
            </div>
          </div>
          <div class="inbox_chat">
            <div class="chat_list" :class="selectedContact == contact.id ? 'active_chat' : ''" style="cursor: pointer;"
              v-for="contact of contacts" :key="contact.id" @click.prevent="() => { selectedContact = contact; }">
              <div class="chat_people">
                <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
                <div class="chat_ib">
                  <h5>{{ extractUser(contact).name }}<span class="chat_date">Dec 25</span></h5>
                  <p>{{ contact.latestMessage?.content ?? '' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mesgs">
          <div ref="msgHistory" class="msg_history">
            <template v-for="message of messages" :key="message.id">
              <div v-if="message.userId !== user.id" class="incoming_msg">
                <div class="received_msg">
                  <div class="received_withd_msg">
                    <p>{{ message.content }}</p>
                    <span class="time_date"> {{ new Date(message.createdAt ?? Date.now()).toLocaleDateString() }}</span>
                  </div>
                </div>
              </div>

              <div v-else class="outgoing_msg">
                <div class="sent_msg">
                  <p>{{ message.content }}</p>
                  <span class="time_date"> {{ new Date(message.createdAt ?? Date.now()).toLocaleDateString() }}</span>
                </div>
              </div>
            </template>

          </div>
          <div class="type_msg">
            <div class="input_msg_write">
              <input @keydown="e => e.key === 'Enter' && sendMessage()" v-model="typed_message" type="text"
                class="write_msg" placeholder="Type a message" />
              <button @click.prevent="() => { console.log('As'); sendMessage() }" class="msg_send_btn" type="button"><i
                  class="fa fa-paper-plane-o" aria-hidden="true"></i></button>
            </div>
          </div>
        </div>
      </div>

      <p class="text-center top_spac"> Design by <a target="_blank"
          href="https://www.linkedin.com/in/sunil-rajput-nattho-singh/">Sunil Rajput</a></p>
    </div>
  </div>
</template>

<style scoped>
@import '../assets/chat.css';
</style>