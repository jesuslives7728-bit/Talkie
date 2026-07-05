const chatMessages = document.querySelector(".chatMessages");
const chatInput = document.querySelector(".chatInput input");
const sendBtn = document.querySelector(".chatInput button");

let shouldAutoScroll = true;

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

    const msg = createMessage(text, "me");

    chatMessages.appendChild(msg);

    chatInput.value = "";

    handleAutoScroll();
}

// ============================
// CREATE MESSAGE
// ============================

function createMessage(text, type = "me") {

    const div = document.createElement("div");
    div.classList.add("message", type);

    div.textContent = text;

    return div;
}

// ============================
// SYSTEM MESSAGE (for matchmaking)
// ============================

window.addSystemMessage = function(text) {

    const div = document.createElement("div");
    div.classList.add("message", "system");

    div.textContent = text;

    chatMessages.appendChild(div);

    handleAutoScroll();
};

// ============================
// AUTO SCROLL CONTROL
// ============================

function handleAutoScroll() {

    const threshold = 80; // px from bottom

    const distanceFromBottom =
        chatMessages.scrollHeight -
        chatMessages.scrollTop -
        chatMessages.clientHeight;

    // only auto-scroll if user is near bottom
    shouldAutoScroll = distanceFromBottom < threshold;

    if (shouldAutoScroll) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// ============================
// OPTIONAL: lock scroll on manual scroll up
// ============================

chatMessages.addEventListener("scroll", () => {

    const threshold = 80;

    const distanceFromBottom =
        chatMessages.scrollHeight -
        chatMessages.scrollTop -
        chatMessages.clientHeight;

    shouldAutoScroll = distanceFromBottom < threshold;
});
