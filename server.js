const express = require('express')
const app = express()
const http = require('http').Server(app)
const socket = require('socket.io')
const cors = require('cors')
const bodyParser = require('body-parser')
const io = socket(http)
const mongoose = require('mongoose')
const  cookieParser = require('cookie-parser');
const userRouter = require('./routes/user')
const authentication = require('./middleware/auth')
const auth = require('./middleware/auth')

// middleware
app.use(cors())
app.use(express.static(__dirname+'/public'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())
app.use('/user',userRouter)

app.get('/chat',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html')
})


let clientSocketIds = [];
let connectedUsers= [];

const getSocketByUserId = (userId) =>{
    let socket = '';
    for(let i = 0; i<clientSocketIds.length; i++) {
        if(clientSocketIds[i].userId == userId) {
            socket = clientSocketIds[i].socket;
            break;
        }
    }
    return socket;
}

io.on('connection', (socket)=>{

    console.log('user is connected')
    socket.on('disconnect', () => {
        console.log("disconnected")
        connectedUsers = connectedUsers.filter(item => item.socketId != socket.id);
        io.emit('updateUserList', connectedUsers)
    });

    socket.on('loggedIn',(user)=>{
        clientSocketIds.push({socket: socket, userId:  user.userId});
        connectedUsers = connectedUsers.filter(item => item.userId != user.userId);
        connectedUsers.push({...user, socketId:socket.id})
        io.emit('updateUserList',connectedUsers)
    })

    socket.on('create', (data)=>{
        console.log("create room")
        socket.join(data.room);
        let withSocket = getSocketByUserId(data.withUserId);
        socket.broadcast.to(withSocket.id).emit("invite",{room:data})
    });

    socket.on('joinRoom', (data)=>{
        socket.join(data.room.room);
    });

    socket.on('message', (data)=>{
        socket.broadcast.to(data.room).emit('message', data);
    })
})

const url = "mongodb+srv://chaitu99:hppynuyr@cluster0.bswum.mongodb.net/ChatsAPI?retryWrites=true&w=majority"

const start = async () => {
    try {
        await mongoose.connect(url)
        http.listen(3001,()=>{
            console.log('server is listening');
        })
    } catch (error) {
        console.log(error);
    }
}
start()



