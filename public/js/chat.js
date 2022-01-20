const socket = io();

const form = document.querySelector("#message-form");
const message = document.querySelector("#message");
const submit = document.querySelector("button");
const locationBtn = document.querySelector("#location");
const messageDiv = document.querySelector("#messages");

//Templates
const messageHtml = document.querySelector("#message-template").innerHTML;
const locationHtml = document.querySelector("#location-template").innerHTML;
const sidebarHtml = document.querySelector("#sidebar-template").innerHTML;

//Options

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoScroll = () => {
  //New message element
  const newMessage = messageDiv.lastElementChild;

  //Height of new message
  const newMessageStyles = getComputedStyle(newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

  //Visible Height
  const visibleHeight = messageDiv.offsetHeight;

  //Height of Message container
  const containerHeight = messageDiv.scrollHeight;

  //How far I have scrolled
  const scrollOffset = messageDiv.scrollTop + visibleHeight;

  messageDiv.scrollTop = messageDiv.scrollHeight;

  // if (containerHeight - newMessageHeight <= scrollOffset) {

  // }

  // console.log(newMessageHeight);
};

socket.on("message", (Msg) => {
  console.log(Msg);

  const html = Mustache.render(messageHtml, {
    username: Msg.username,
    message: Msg.text,
    createdAt: moment(Msg.createdAt).format("h:mm a"),
  });

  messageDiv.insertAdjacentHTML("beforeend", html);

  autoScroll();
});

socket.on("location-message", (location) => {
  console.log(location);

  const html = Mustache.render(locationHtml, {
    username: location.username,
    url: location.url,
    createdAt: moment(location.createdAt).format("h:mm a"),
  });

  messageDiv.insertAdjacentHTML("beforeend", html);
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarHtml, {
    room,
    users,
  });

  document.querySelector("#sidebar").innerHTML = html;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const msg = event.target.elements.message.value;
  submit.setAttribute("disabled", "disabled");

  socket.emit("sendMessage", msg, (error) => {
    submit.removeAttribute("disabled");
    message.value = "";
    message.focus();
    if (error) return console.log(error);

    console.log("The message was Delivered!");
  });
});

locationBtn.addEventListener("click", () => {
  if (!navigator.geolocation)
    return alert("Geolocation is not supported by your browser");

  locationBtn.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        locationBtn.removeAttribute("disabled");
        console.log("The location has been shared in the console.");
      }
    );
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
