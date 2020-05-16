const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const formatMessage = require("./utils/messages");
const {
   userJoin,
   getCurrentUser,
   userLeave,
   getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const boatName = "Chat boat";

// Run when client connects
io.on("connection", (socket) => {
   console.log("New WS Connection...");

   socket.on("joinRoom", ({ username, room }) => {
      const user = userJoin(socket.id, username, room);

      socket.join(user.room);
      // Welcome a current user that joined the chat room
      socket.emit("message", formatMessage(boatName, "Welcome to Chat app "));

      // Broadcast when a user connects to a specific room
      socket.broadcast
         .to(user.room)
         .emit(
            "message",
            formatMessage(boatName, `${user.username} has joined the chat`)
         );
   });

   // Listen for chatMessage
   socket.on("chatMessage", (msg) => {
      const user = getCurrentUser(socket.id);

      io.to(user.room).emit("message", formatMessage(user.username, msg)); // This will emit it to every one in the group
      console.log(msg);
   });

   socket.on("disconnect", () => {
      const user = userLeave(socket.id);

      if (user) {
         io.to(user.room).emit(
            "message",
            formatMessage(boatName, `${user.username} has left the chat room`)
         );
      }
   });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
