// ============================
// UI CONTROLLER (Talkie)
// ============================

const videoCanvas = document.getElementById("videoCanvas");

// Buttons
const findStrangerBtn = document.querySelector(".primaryButton");
const addPeopleBtn = document.querySelectorAll(".secondaryButton")[0];
const inviteFriendsBtn = document.querySelectorAll(".secondaryButton")[1];

// Footer buttons
const layoutBtn = document.querySelector(".controls button:nth-child(7)");
const nextBtn = document.querySelector(".controls button:nth-child(6)");

// ============================
// FIND STRANGER BUTTON
// ============================

findStrangerBtn?.addEventListener("click", () => {
    if (window.startSearch) {
        window.startSearch();
    }
});

// ============================
// ADD PEOPLE (GROUP CALL PLACEHOLDER)
// ============================

addPeopleBtn?.addEventListener("click", () => {

    if (window.addSystemMessage) {
        window.addSystemMessage("👥 Group call feature coming soon");
    }

    console.log("Add people clicked");
});

// ============================
// INVITE FRIENDS (PLACEHOLDER)
// ============================

inviteFriendsBtn?.addEventListener("click", () => {

    if (window.addSystemMessage) {
        window.addSystemMessage("📨 Invite system coming soon");
    }

    console.log("Invite friends clicked");
});

// ============================
// NEXT STRANGER BUTTON
// ============================

nextBtn?.addEventListener("click", () => {

    if (window.nextStranger) {
        window.nextStranger();
    }
});

// ============================
// LAYOUT TOGGLE
// ============================

let compactMode = false;

layoutBtn?.addEventListener("click", () => {

    compactMode = !compactMode;

    if (compactMode) {
        videoCanvas.style.transform = "scale(0.9)";
        videoCanvas.style.transition = "0.3s ease";
    } else {
        videoCanvas.style.transform = "scale(1)";
    }

    if (window.addSystemMessage) {
        window.addSystemMessage(
            compactMode ? "📐 Compact layout enabled" : "📐 Normal layout enabled"
        );
    }
});

// ============================
// GLOBAL KEYBINDS
// ============================

document.addEventListener("keydown", (e) => {

    const key = e.key.toLowerCase();

    // N = next stranger
    if (key === "n") {
        if (window.nextStranger) window.nextStranger();
    }

    // L = layout toggle
    if (key === "l") {
        layoutBtn?.click();
    }

    // F = find stranger
    if (key === "f") {
        findStrangerBtn?.click();
    }
});

// ============================
// INIT LOG
// ============================

window.addEventListener("load", () => {
    console.log("Talkie UI loaded");
});
