const callOverlay = document.getElementById("callOverlay");
const statusText = document.getElementById("callStatusText");
const subText = document.getElementById("callSubText");
const cancelBtn = document.getElementById("cancelSearchBtn");

const findBtn = document.querySelector(".primaryButton");

let searching = false;
let socket = null;

// ============================
// INIT SOCKET (FROM APP)
// ============================

window.initMatchmaking = function (_socket) {
    socket = _socket;
};

// ============================
// START SEARCH
// ============================

findBtn.addEventListener("click", startSearch);

function startSearch() {

    if (searching || !socket) return;

    searching = true;

    callOverlay.classList.remove("hidden");

    statusText.textContent = "Finding someone to talk to...";
    subText.textContent = "Searching for a random stranger...";

    // REAL matchmaking request
    socket.emit("find-stranger");
}

// ============================
// SOCKET EVENTS
// ============================

if (typeof window !== "undefined") {

    // waiting state
    window.handleWaitingState = function () {
        statusText.textContent = "Waiting for a stranger...";
        subText.textContent = "Hold on, matching you...";
    };

    // matched state
    window.handleMatched = function (data) {

        statusText.textContent = "Stranger found!";
        subText.textContent = "Connecting you now...";

        setTimeout(() => {

            callOverlay.classList.add("hidden");
            searching = false;

            // START REAL CALL
            if (window.startWebRTC) {
                window.startWebRTC(socket, data.room, data.initiator);
            }

            // START CHAT CONTEXT
            if (window.setChatContext) {
                window.setChatContext(socket, data.room);
            }

            // UI message
            if (window.addSystemMessage) {
                window.addSystemMessage("🔗 Connected to a stranger");
            }

        }, 800);
    };
}

// ============================
// CANCEL SEARCH
// ============================

cancelBtn.addEventListener("click", () => {

    if (!searching || !socket) return;

    searching = false;

    socket.emit("cancel-search");

    callOverlay.classList.add("hidden");

    statusText.textContent = "Finding someone to talk to...";
    subText.textContent = "You will be connected to a random stranger";
});
