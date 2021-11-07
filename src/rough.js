const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const pathDirectory = path.join(__dirname, "../public");
app.use(express.static(pathDirectory));

let count = 0;

io.on("connection", (socketio) => {
  console.log("New  connection added");
  socketio.emit("eventcountUpdated");

  socketio.on("increment", () => {
    count++;
    console.log("clicked and increment in server side", count);
    // socketio.emit("sendingCount", count);
    io.emit("sendingCount", count);
  });

  //message to new client
  let msg = "New user joined";
  socketio.broadcast.emit("message", msg);

  //message received from client
  socketio.on("sendMessage", (msg) => {
    io.emit("msg", msg);
    console.log("server side msg", msg);
  });
});

server.listen(port, () => {
  console.log(`port listen on ${port}`);
});
