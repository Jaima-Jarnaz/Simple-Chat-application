const socket = io();

const btnsubmit = document.querySelector("#submit");
const inputForm = document.querySelector("#inputform");
const locationBtn = document.querySelector("#sharelocation");
const msgDiv = document.querySelector("#messagediv");
const locationDiv = document.querySelector("#store-location");

//template
const templateMessage = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemp = document.querySelector("#sidebar-template").innerHTML;

//options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// const { username, room } = Qs.parse(location.search, {
//   ignoreQueryPrefix: true,
// });
socket.emit("join", { username, room }, (error) => {
  console.log("errors arive");
});

//receving welcome msg
socket.on("message", (msg) => {
  console.log(msg);
  const htmlTemplate = Mustache.render(templateMessage, {
    msg: msg.text,
    username: msg.username,
    createdAt: moment(msg.createdAt).format("h:m a"),
  });
  msgDiv.insertAdjacentHTML("beforeend", htmlTemplate);
});

//receving others msg from server
socket.on("clientmessage", (msg) => {
  console.log(msg);
  const htmlTemplate = Mustache.render(templateMessage, {
    msg: msg.text,
    username: msg.username,
  });
  msgDiv.insertAdjacentHTML("beforeend", htmlTemplate);
});

//sending msg from client

const msg = document
  .querySelector("#message-form")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    btnsubmit.setAttribute("disabled", "disabled");
    const msg1 = e.target.sendmessage.value;
    socket.emit("sendMessage", msg1, { username, room }, () => {
      console.log("Mesaage Delivered");
      btnsubmit.removeAttribute("disabled");
      inputForm.value = "";
    });
  });

///````````````````specific room users``````````````

socket.on("roomData", ({ room, users }) => {
  console.log("current room", room);
  console.log("all users in a room", users);
  const htmltemp = Mustache.render(sidebarTemp, {
    room,
    users: users,
  });
  document.querySelector("#sidebar-chat").innerHTML = htmltemp;
  //const roomUsersDiv = document.querySelector("#sidebar-chat");
  //roomUsersDiv.insertAdjacentHTML( htmltemp);
});

//share location

const locationFind = locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Sorry your location is not found!!!!!!");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    locationBtn.setAttribute("disabled", "disabled");
    locationBtn.innerHTML = "Disabled";
    locationBtn.style.color = "red";
    socket.emit(
      "locationsend",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      (msg) => {
        console.log("location sending from client", msg); ///callback function sets
      }
    );
  });
});

//location receive from server

socket.on("locationadress", (urlLocationTime) => {
  console.log(urlLocationTime); //object

  const htmlTemplateLocation = Mustache.render(locationTemplate, {
    url: urlLocationTime.url,
    createdAt: moment(urlLocationTime.createdAt).format(
      "MMMM Do YYYY, h:mm:ss a"
    ),
  });
  locationDiv.insertAdjacentHTML("beforeend", htmlTemplateLocation);
});
