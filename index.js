const express = require('express') //se llama al modulo de express
const handlebars = require('express-handlebars')
const { Server: HttpServer } = require('http')
const { Server: IoServer} = require('socket.io')

/* constantes de almacenamiento */
const messages = []
const products = []
/* ------------------------- */

const app = express()
const httpServer = new HttpServer(app)
const io = new IoServer(httpServer)

// Se crea el servidor, se elige el numero de puerto.
const PORT = 3000

httpServer.listen(PORT, () => console.log('SERVER ON'))
httpServer.on('error', (error) => console.log({mensaje: `hubo un error :( ${error}`}))
app.use(express.static('public')) 

io.on('connection', (socket) => {
    // "connection" se ejecuta la primera vez que se abre una nueva conexión
    console.log('Usuario conectado')
    // Se imprimirá solo la primera vez que se ha abierto la conexión
    socket.emit('history', messages)
    socket.on('notification', (data)=>{
        console.log(data)
    })
    socket.on('message', (data) =>{
        messages.push(data)
        console.log(data)
        io.sockets.emit('refresh', data)
    })
    socket.emit('refresh', messages)
    
    /* product sockets------------- */
    socket.emit('refreshProds', products)
    
    socket.on('newProd', (data) =>{
        data = {...data, id: (products.length === 0 ? 1 : (products[products.length - 1].id + 1))}
        products.push(data)
        console.log(products)
        io.sockets.emit('refreshProds', products)
    })
})  