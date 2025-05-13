const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = 3000

io.on("connection", (socket) => {
  console.log(`Usuário ${socket.id} conectado no servidor`)

  socket.on("disconnect", () => { })
})

app.use(express.static('cliente/'))
server.listen(port, () => {
  console.log('Servidor rodando!')
})