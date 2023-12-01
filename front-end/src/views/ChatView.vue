<script setup lang="ts">
import router from '@/router';
import api from '@/services/api';
import { useAuth } from '@/stores/auth';
import { useConnectionStore } from '@/stores/connection';
import { useMessagesStore, type Message } from '@/stores/messages';
import { useNotification } from '@kyvg/vue3-notification';
import { isAxiosError } from 'axios';
import { storeToRefs } from 'pinia';

import { onMounted, ref, watch } from 'vue';
const { token, user } = useAuth()
const contacts = ref<any[]>([])
const { notify } = useNotification()
const selectedContact = ref<any>(null)
const { state, connect } = useConnectionStore()
const messageStore = useMessagesStore()
const {  currentContact, messages} = storeToRefs(messageStore)

const typed_message = ref<string>('')

watch(selectedContact, async () => {
  if (!state.isConnected) connect();
  if (selectedContact.value) {
    messageStore.listMessageFrom(selectedContact.value.id as number )
    messageStore.setCurrentContact(selectedContact.value.id)
  }
})

const extractUser = (contact: any) => {
  if (contact.userDestination.id == user.id) {
    return contact.user;
  } else {
    return contact.userDestination
  }
}
onMounted(() => {
  api.get('/contacts', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(({ data }) => contacts.value = data)
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

const sendMessage = () => {
  if (currentContact.value){
    messageStore.createMessage({ contactId: currentContact.value, content: typed_message.value, userID: user.id })
    typed_message.value = ''
  }
  typed_message.value = ''
}
</script>
<template>
  <div class="container">
    {{ state.isConnected ? "Sim" : "Não" }}
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
                <input type="text" class="search-bar" placeholder="Search">
                <span class="input-group-addon">
                  <button type="button"> <i class="fa fa-search" aria-hidden="true"></i> </button>
                </span>
              </div>
            </div>
          </div>
          <div class="inbox_chat">
            <div class="chat_list active_chat" style="cursor: pointer;" v-for="contact of contacts" :key="contact.id"
              @click="selectedContact = contact">
              <div class="chat_people">
                <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
                <div class="chat_ib">
                  <h5>{{ extractUser(contact).firstName }}<span class="chat_date">Dec 25</span></h5>
                  <p>{{  contact.latestMessage.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mesgs">
          <div class="msg_history">
            <template v-for="message of messages" :key="message.id">
              <div v-if="message.userID !== user.id" class="incoming_msg">
                <div class="received_msg">
                  <div class="received_withd_msg">
                    <p>{{ message.content }}</p>
                    <span class="time_date"> 11:01 AM | June 9</span>
                  </div>
                </div>
              </div>

              <div v-else class="outgoing_msg">
                <div class="sent_msg">
                  <p>{{ message.content }}</p>
                  <span class="time_date"> 11:01 AM | June 9</span>
                </div>
              </div>
            </template>
 
          </div>
          <div class="type_msg">
            <div class="input_msg_write">
              <input v-model="typed_message" type="text" class="write_msg" placeholder="Type a message" />
              <button  @click.prevent="() => {console.log('As'); sendMessage()}" class="msg_send_btn" type="button"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>
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