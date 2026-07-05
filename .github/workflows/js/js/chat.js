const chatMessages = document.querySelector(".chatMessages");
const chatInput = document.querySelector(".chatInput input");
const sendBtn = document.querySelector(".chatInput button");

let socket = null;
let currentRoom = null;

// ============================
// INIT SOCKET FROM WEBRTC
// ============================

window.setChatContext = function (_socket, room) {
    socket = _socket;
    currentRoom = room;

    listenForMessages();
};

// ============================
// SEND MESSAGE
// ============================

sendBtn.addEventListener("click", sendMessage);

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {

    const text = chatInput.value.trim();
    if (!text || !socket || !currentRoom) return;

    // show locally
    const msg = createMessage(text, "me");
    chatMessages.appendChild(msg);

    // send to stranger
    socket.emit("chat-message", {
        room: currentRoom,
        message: text
    });

    chatInput.value = "";
    handleAutoScroll();
}

// ============================
// RECEIVE MESSAGES
// ============================

function listenForMessages() {

    socket.on("chat-message", (text) => {

        const msg = createMessage(text, "stranger");
        chatMessages.appendChild(msg);

        handleAutoScroll();
    });
}

// ============================
// MESSAGE UI
// ============================

function createMessage(text, type = "me") {

    const div = document.createElement("div");
    div.classList.add("message", type);

    div.textContent = text;

    return div;
}

// ============================
// SYSTEM MESSAGE
// ============================

window.addSystemMessage = function(text) {

    const div = document.createElement("div");
    div.classList.add("message", "system");

    div.textContent = text;

    chatMessages.appendChild(div);

    handleAutoScroll();
};

// ============================
// AUTO SCROLL
// ============================

function handleAutoScroll() {

    const threshold = 80;

    const distanceFromBottom =
        chatMessages.scrollHeight -
        chatMessages.scrollTop -
        chatMessages.clientHeight;

    if (distanceFromBottom < threshold) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}
