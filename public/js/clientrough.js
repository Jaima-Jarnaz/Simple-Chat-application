const socket = io();

socket.on("eventcountUpdated", () => {
  console.log("Count updted in client side");
});

//receving welcome msg
socket.on("message", (msg) => {
  console.log(msg);
});

socket.on("msg", (msg) => {
  console.log("msg from server", msg);
});

//sending msg from client

const msg = document
  .querySelector("#message-form")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    const msg1 = e.target.sendmessage.value;
    socket.emit("sendMessage", msg1);
  });

/////btn click event

document.querySelector("#increment").addEventListener("click", () => {
  socket.emit("increment", () => {
    console.log("clicked  in client side and sending to server");
  });
  socket.on("sendingCount", (count) => {
    console.log("Receving  in client side and increment", count);
  });
});
