const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

// Get username and room from the URL
const { username, room } = Qs.parse(location.search, {
   ignoreQueryPrefix: true,
});

console.log(username, room);

const socket = io();

// Join chatroom
socket.emit("joinRoom", { username, room });

// Message from the server
socket.on("message", (message) => {
   console.log(message);
   outputMessage(message);

   // Scroll down
   chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
   e.preventDefault();

   // Get message text from the form input
   const msg = e.target.elements.msg.value;

   // Emit message to server
   socket.emit("chatMessage", msg);

   // Clear input
   e.currentTarget.elements.msg.value = "";
   e.currentTarget.elements.msg.focus();
});

// Output message to the DOM
function outputMessage(message) {
   const div = document.createElement("div");
   div.classList.add("message");
   div.innerHTML = `<p class='meta'>${message.username} <span> ${message.time}</span></p>
  <p class='text'>
    ${message.text}
  </p>`;
   document.querySelector(".chat-messages").appendChild(div);
}
