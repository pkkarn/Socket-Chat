const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
      }
})

io.on('connection', (client) => {
    console.log(client.id, 'client connected')
    // Write message channels from client
    client.on('join', (data) => {
        console.log(data)
        client.emit('messages', 'from Server')
    })

    client.on('group', (data) => {
        console.log(data)

        client.emit('broad', data) // to send current client this message
        client.broadcast.emit('broad', data) // to send All other connected clients
    })

    client.on('typing', () => {
        client.broadcast.emit('typingUser');
    })
})

app.get('/', (req, res) => {res.send({
    msg: 'hello world'
})})

server.listen(4200, () => {
    console.log('listening on port')
})