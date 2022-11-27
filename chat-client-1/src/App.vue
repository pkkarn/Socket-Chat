<template>
  <div id="root">
    <div v-if="isPrompt" id="promptScreen">
      <input class="app_inp" type="text" placeholder="Enter your username" v-model="username">
      <button class="app_btn" @click="setUsername">Set</button>
    </div>
    <div id="mainChat" v-else>
      <h1>Real-Time Chat - Hi, {{username}}</h1>
      <form id="chatForm" @submit.prevent="sendMessage">
        <div>
          <input class="app_inp" type="text" placeholder="Enter your message" @keydown="sendTyping" v-model="chat_group" />
        </div>
        <button class="app_btn" type="submit">Submit</button>
      </form>

      <span v-if="isTyping">Typing...</span>

      <div v-for="paylaod in allMessages">{{ paylaod.message }} - <strong>{{ paylaod.username }}</strong></div>
    </div>

  </div>
</template>

<script>
import { io } from "socket.io-client";
const socket = io.connect('http://localhost:4200') // Establish the connection
  export default {
    data() {
      return {
        message: '',
        chat_group: '',
        allMessages: [],
        username: null,
        isTyping: false,
        isPrompt: true,
      }
    },

    mounted() {

    },

    methods: {
      socketFlow() {
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
          setTimeout(() => {
            this.isTyping = false
          }, 2000)
        })
      },
      setUsername() {
        this.isPrompt = false;
        this.socketFlow();
      },
      sendMessage() {
          socket.emit('group', {
            message: this.chat_group,
            username: this.username
          })

          this.chat_group = ''
      },
      sendTyping() {
        socket.emit('typing')
      }
    }
  }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap');

#promptScreen {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Poppins', sans-serif;
}

#mainChat {
  font-family: 'Poppins', sans-serif;
}

#root {
  margin: 10px;
}

.app_inp {
  padding: 5px;
  border: 1px solid black;
  border-radius: 5px;
  width: 99%;
  padding: 10px;
}

.app_inp:focus {
  outline: none;
}

h1{
  color: rgb(109, 109, 255);
}

.app_btn {
  width: 100%;
  font-family: 'Poppins', sans-serif;
  background: rgb(109, 109, 255);
  color: #fff;
  outline: none;
  border: none;
  padding: 5px;
  margin: 10px 4px;
  border-radius: 5px;
}

.app_btn:focus {
  background: rgb(28, 28, 255);
}
.app_btn:hover {
  background: rgb(28, 28, 255);
}

</style>