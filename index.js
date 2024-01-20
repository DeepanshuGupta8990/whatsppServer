const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes.js")
const messagesRoute = require("./routes/messagesRoute.js")
const socket = require("socket.io");
const serverIP = process.env.REPL_OWNER;
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/msg', messagesRoute);

mongoose.connect('mongodb+srv://deepanshugupta899:ZxEBEU2tZW5sI9BF@cluster0.ki6bgeh.mongodb.net/inotebook', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("DB connected");
}).catch((err) => {
  console.log(err);
})

app.get("/", (req, res) => {
  res.send("Hello World");
})

const server = app.listen((process.env.PORT || 9001), () => {
  console.log("The server is running")
})

const io = socket(server, {
  cors: {
    origin: '*',
  },
  pingInterval: 2000,
  pingTimeout: 5000,
});

global.onlineUsers = new Map();
global.onlineUsers2 = new Map();

io.on('connection', (socket) => {
  // console.log("a user connected");

  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    // console.log(userId)
    onlineUsers.set(userId, socket.id);
    onlineUsers2.set(socket.id, userId);
    socket.broadcast.emit("userConnected", userId);
    socket.broadcast.emit("recieveCheckStatus", {
      id: userId,
      status: true
    })
  });

  socket.on("checkStatus", (id) => {
    const status = onlineUsers.get(id);
    if (status) {
      socket.emit("recieveCheckStatus", {
        id: id,
        status: true
      })
    }
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    // console.log(sendUserSocket)
    if (sendUserSocket) {
      // console.log(data)
      io.to(sendUserSocket).emit("msg-recieve", data)
    }
  })

  socket.on("sendingUserdetail", (data) => {
    io.sockets.sockets.forEach((clientSocket) => {
      if (clientSocket.id === onlineUsers.get(data.otherUserId)) {
        io.to(onlineUsers.get(data.clientId)).emit('recievingOnlineStatus', true)
      } else {
        io.to(onlineUsers.get(data.clientId)).emit('recievingOnlineStatus', false)
      }
    })
  })

  // socket.on("disconnecting1", (data) => {
  //   socket.disconnect();
  //   // console.log('disconnected userId:', data)
  // })
  socket.on('disconnect', () => {
    const userToDelete = onlineUsers2.get(socket.id)
    socket.broadcast.emit("userDisconnected", userToDelete);
    onlineUsers2.delete(socket.id);
    onlineUsers.delete(userToDelete);
  })
})