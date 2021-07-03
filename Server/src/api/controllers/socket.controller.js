
const express = require('express');
const app = express();
const {
  socketPort
} = require('./../../config/vars');
const server = app.listen(socketPort);
const socketIo = require('socket.io');
const io = socketIo(server,
  { cors: { origin: "http://localhost:3001 " } }
);
const User = require('./../models/user.model');
const editor = require('./editor.controller');
const logger = require('../../config/logger')


logger.info("Start socket server: " + socketPort)



let interval;

io.on("connection", (socket) => {
  console.log("New client connected: "+socket.id);
  if (interval) {
    clearInterval(interval);
  }

  //when progress bar starts, socket send the editing status constantly.

  socket.on('start', (data) => {
    console.log(data);
    interval = setInterval(() => getApiAndEmit(socket), 1000);
  })
  socket.on("disconnect", () => {
    console.log("Client disconnected: "+socket.id);
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  // Emitting a new message. Will be consumed by the client
  socket.emit("progressStatus", editor.progressStatus);
};
