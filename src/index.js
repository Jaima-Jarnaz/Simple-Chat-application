const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const {
  addUser,
  removeUser,
  getUser,
  getAllUserDataInRoom,
} = require("./utils/users.js");

const { getMessage, getLocation } = require("./utils/getmessage.js");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const pathDirectory = path.join(__dirname, "../public");
app.use(express.static(pathDirectory));

io.on("connection", (socketio) => {
  console.log("--New  connection added---");

  //give message to new client
  //room join
  socketio.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socketio.id, username, room });
    console.log("user in server", user);
    if (error) {
      return callback(error);
    }

    socketio.join(user.room);
    let msg = `${user.username} just joined!!!!!`;
    console.log(user.username);
    socketio.broadcast
      .to(user.room)
      .emit("message", getMessage(msg, user.username));

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getAllUserDataInRoom(user.room),
    });

    callback();
  });

  //message received from client
  socketio.on("sendMessage", (msg, { username, room }, callback) => {
    io.to("mim").emit("clientmessage", getMessage(msg, username));
    callback();
  });

  //if any connection gone or any client leave
  socketio.on("disconnect", () => {
    const userRemovedData = removeUser(socketio.id);
    console.log("remove data come in server", userRemovedData);
    console.log(userRemovedData.username);
    if (userRemovedData) {
      let msg = `${userRemovedData.username} leave from the group!!!`;

      io.to(userRemovedData.room).emit(
        "message",
        getMessage(msg, userRemovedData.username)
      );

      io.to(userRemovedData.room).emit("roomData", {
        room: userRemovedData.room,
        users: getAllUserDataInRoom(userRemovedData.room),
      });
    }
  });

  ///location shared
  socketio.on("locationsend", (coords, callback) => {
    url = `https://google.com/maps/${coords.latitude},${coords.longitude}`;
    io.emit("locationadress", getLocation(url));
    callback("Location Shared");
  });

  //io end
});

server.listen(port, () => {
  console.log(`port listen on ${port}`);
});
