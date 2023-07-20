const socket = io();
let message = document.getElementById("userMessage");
let restCharacters = document.getElementById("restCharacters");
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("chatForm").addEventListener("submit", (evt) => {
    evt.preventDefault();
    sendMessages();
  });
  message.oninput = () => {
    let remaining = 100 - message.value.length;
    remaining = Math.max(remaining, 0);
    restCharacters.style.color = remaining === 0 ? '#fc3030' : '#ffffffb8';
    restCharacters.textContent = remaining;
  }
});

let messages = [];
socket.on("all messages", async (res) => {
  messages = res;
  showMessages(messages);
});

const showMessages = (messages) => {
  const messageContainer = document.getElementById("messages");
  messageContainer.innerHTML = "";
  messages.forEach((element) => {
    const message = document.createElement("div");
    message.className = "messageContainer";
    message.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path fill="#efa51e" d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"/></svg>
    <h3 class="userChat">${element.user}:</h3> 
    <p class="userMessage">${element.message}</p>`;
    messageContainer.appendChild(message);
  });
};

const sendMessages = async () => {
  let user = document.getElementById("user");
  await fetch(`${window.location.href}`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: user.value, message: message.value }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "error") {
        alerts(data.status, data.payload)
      }
    });

  message.value = "";
};
