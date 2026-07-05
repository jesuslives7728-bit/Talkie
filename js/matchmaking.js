// ============================
// MATCHMAKING SYSTEM (Talkie)
// ============================

let socket = null;
let currentRoom = null;
let isMatched = false;

// Connect overlay elements
const callOverlay = document.getElementById("callOverlay");
const statusText = document.getElementById("callStatusText");
const subText = document.getElementById("callSubText");
const cancelBtn = document.getElementById("cancelSearchBtn");

const findBtn = document.querySelector(".primaryButton");

// ============================
// INIT SOCKET CONNECTION
// ============================

function initSocket() {

    socket = io("https://talkie-kesc.onrender.com"); // change if local

    socket.on("waiting", () => {
        showOverlay("Finding someone to talk to...", "Searching for a random stranger...");
    });

    socket.on("matched", (data) => {
        handleMatched(data);
    });

    socket.on("partner-disconnected", () => {
        if (window.addSystemMessage) {
            window.addSystemMessage("⚠ Stranger disconnected");
        }

        resetCall();
    });
}

// ============================
// START SEARCH
// ============================

function startSearch() {

    if (!socket) initSocket();

    isMatched = false;

    showOverlay("Finding someone to talk to...", "Searching for a random stranger...");

    socket.emit("find-stranger");
}

// ============================
// MATCH FOUND
// ============================

function handleMatched(data) {

    currentRoom = data.room;
    isMatched = true;

    showOverlay("Stranger found!", "Connecting you now...");

    setTimeout(() => {

        hideOverlay();

        // START WEBRTC
        if (window.startWebRTC) {
            window.startWebRTC(socket, currentRoom, data.initiator);
        }

        // CONNECT CHAT
        if (window.setChatContext) {
            window.setChatContext(socket, currentRoom);
        }

        if (window.addSystemMessage) {
            window.addSystemMessage("🔗 Connected to stranger");
        }

    }, 1200);
}

// ============================
// NEXT STRANGER
// ============================

function nextStranger() {

    if (!socket) return;

    socket.emit("next-stranger");

    resetCall();

    if (window.spawnStrangerVideo) {
        window.spawnStrangerVideo();
    }

    if (window.addSystemMessage) {
        window.addSystemMessage("🔄 Finding new stranger...");
    }
}

// ============================
// RESET STATE
// ============================

function resetCall() {
    currentRoom = null;
    isMatched = false;
}

// ============================
// OVERLAY UI
// ============================

function showOverlay(title, subtitle) {
    if (!callOverlay) return;

    callOverlay.classList.remove("hidden");

    statusText.textContent = title;
    subText.textContent = subtitle;
}

function hideOverlay() {
    if (!callOverlay) return;

    callOverlay.classList.add("hidden");
}

// ============================
// CANCEL BUTTON
// ============================

cancelBtn?.addEventListener("click", () => {

    if (!socket) return;

    socket.emit("next-stranger");
    resetCall();
    hideOverlay();

    if (window.addSystemMessage) {
        window.addSystemMessage("❌ Search cancelled");
    }
});

// ============================
// FIND STRANGER BUTTON
// ============================

findBtn?.addEventListener("click", () => {
    startSearch();
});

// ============================
// FOOTER NEXT BUTTON (optional hook)
// ============================

const nextBtn = document.querySelector(".controls .leave");

if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        nextStranger();
    });
}

// ============================
// GLOBAL HOOKS
// ============================

window.startSearch = startSearch;
window.nextStranger = nextStranger;
