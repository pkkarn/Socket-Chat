const express = require('express');
const app = express();
const server = require('http').createServer(app);
const welcomHandler = require('./handlers/welcomeHandlers')
const chatHandler = require('./handlers/chatHandlers')
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
      }
})

function onSocketConnection(client) {
    welcomHandler(io, client);
    chatHandler(io, client);
}

io.on('connection', onSocketConnection)

app.get('/', (req, res) => {res.send({
    msg: 'hello world'
})})

server.listen(4200, () => {
    console.log('listening on port')
})