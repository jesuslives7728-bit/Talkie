const callOverlay = document.getElementById("callOverlay");
const statusText = document.getElementById("callStatusText");
const subText = document.getElementById("callSubText");
const cancelBtn = document.getElementById("cancelSearchBtn");

const findBtn = document.querySelector(".primaryButton"); // 🌍 Find Stranger

let searching = false;
let searchTimeout = null;

// ============================
// START SEARCH
// ============================

findBtn.addEventListener("click", startSearch);

function startSearch() {
    if (searching) return;

    searching = true;

    // show overlay
    callOverlay.classList.remove("hidden");

    statusText.textContent = "Finding someone to talk to...";
    subText.textContent = "Searching for a random stranger...";

    // simulate matchmaking delay
    searchTimeout = setTimeout(() => {
        connectStranger();
    }, 3000 + Math.random() * 3000);
}

// ============================
// CONNECT STRANGER
// ============================

function connectStranger() {

    statusText.textContent = "Stranger found!";
    subText.textContent = "Connecting you now...";

    setTimeout(() => {
        callOverlay.classList.add("hidden");
        searching = false;

        // trigger fake "user joined"
        triggerCallConnected();

    }, 1500);
}

// ============================
// CANCEL SEARCH
// ============================

cancelBtn.addEventListener("click", () => {

    if (!searching) return;

    clearTimeout(searchTimeout);
    searching = false;

    callOverlay.classList.add("hidden");

    statusText.textContent = "Finding someone to talk to...";
    subText.textContent = "You will be connected to a random stranger";
});

// ============================
// CALL CONNECTED EVENT
// ============================

function triggerCallConnected() {

    // simple placeholder behavior for now
    const chat = document.querySelector(".chatMessages");

    if (chat) {
        const msg = document.createElement("div");
        msg.className = "systemMessage";
        msg.textContent = "🔗 Connected to a new stranger";
        chat.appendChild(msg);
    }

    console.log("Stranger connected (placeholder)");
}
