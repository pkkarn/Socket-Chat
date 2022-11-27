<template>
  <div>
     {{username}}
    <form @submit.prevent="sendMessage">
      <input type="text" @keydown="sendTyping" v-model="chat_group" />
      <button type="submit">Submit</button>
    </form>

    <span v-if="isTyping">Typing...</span>

    <div v-for="paylaod in allMessages">{{ paylaod.message }} by {{ paylaod.username }}</div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
const socket = io.connect('http://localhost:4200') // Establish the connection
  export default {
    data() {
      return {
        message: 'null',
        chat_group: 'null',
        allMessages: [],
        username: null,
        isTyping: false
      }
    },

    mounted() {
      this.username = prompt('username')
      socket.on('connect', () => { // Once connected
        console.log('Socket connected')
        socket.emit('join', `Hi from client ${this.username}`)
      })

      socket.on('messages', (data) => {
        this.message = data;
      })

      socket.on('broad', (data) => {
        this.allMessages.push(data);
      })

      socket.on('typingUser', () => {
        this.isTyping = true
        setTimeout(() => this.isTyping = false, 2000)
      })
    },

    methods: {
      sendMessage() {
          socket.emit('group', {
            message: this.chat_group,
            username: this.username
          })
      },
      
      sendTyping() {
        socket.emit('typing')
      }
    }
  }
</script>

<style scoped>

</style>