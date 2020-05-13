const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const formatMessage = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const boatName = "Chat boat";

// Run when client connects
io.on("connection", socket => {
  console.log("New WS Connection...");

  // Welcome a current user that joined the chat room
  socket.emit("message", formatMessage(boatName, "Welcome to Chat app "));

  // Broadcast when a user connects
  socket.broadcast.emit("message", "A user has joined the chat");

  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat room");
  });

  // Listen for chatMessage
  socket.on("chatMessage", msg => {
    io.emit("message", msg); // This will emit it to every one in the group
    console.log(msg);
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
