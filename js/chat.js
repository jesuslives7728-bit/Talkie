// ============================
// CHAT SYSTEM (Talkie)
// ============================

const chatMessages = document.querySelector(".chatMessages");
const chatInput = document.querySelector(".chatInput input");
const sendBtn = document.querySelector(".chatInput button");

let socket = null;
let currentRoom = null;

// ============================
// CONNECT CONTEXT FROM WEBRTC
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
    if (!text) return;

    // show locally
    const msg = createMessage(text, "me");
    chatMessages.appendChild(msg);

    // send to server if connected
    if (socket && currentRoom) {
        socket.emit("chat-message", {
            room: currentRoom,
            message: text
        });
    }

    chatInput.value = "";
    handleAutoScroll();
}

// ============================
// RECEIVE MESSAGES
// ============================

function listenForMessages() {

    if (!socket) return;

    socket.on("chat-message", (data) => {

        const msg = createMessage(data.message || data, "stranger");
        chatMessages.appendChild(msg);

        handleAutoScroll();
    });

    socket.on("partner-disconnected", () => {
        addSystemMessage("⚠ Stranger disconnected");
    });
}

// ============================
// CREATE MESSAGE UI
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

window.addSystemMessage = function (text) {

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
