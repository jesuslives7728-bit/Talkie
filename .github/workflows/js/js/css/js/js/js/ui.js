const findStrangerBtn = document.querySelector(".primaryButton");
const addPeopleBtn = document.querySelectorAll(".secondaryButton")[0];
const inviteFriendsBtn = document.querySelectorAll(".secondaryButton")[1];

const strangerFooterBtn = document.querySelector(".controls button:nth-child(6)");
const layoutBtn = document.querySelector(".controls button:nth-child(7)");

const videoCanvas = document.getElementById("videoCanvas");

// ============================
// FIND STRANGER (MAIN FLOW)
// ============================

findStrangerBtn.addEventListener("click", () => {
    if (window.startSearch) {
        window.startSearch();
    }
});

// ============================
// ADD PEOPLE (placeholder group call)
// ============================

addPeopleBtn.addEventListener("click", () => {

    alert("Group call feature coming next step");

});

// ============================
// INVITE FRIENDS
// ============================

inviteFriendsBtn.addEventListener("click", () => {

    alert("Invite system coming next step");

});

// ============================
// NEXT STRANGER BUTTON (footer)
// ============================

if (strangerFooterBtn) {
    strangerFooterBtn.addEventListener("click", () => {

        if (window.startSearch) {
            window.startSearch();
        }

        if (window.addSystemMessage) {
            window.addSystemMessage("🔄 Switching to next stranger...");
        }

        // remove current remote video
        const remote = document.querySelector(".videoCard.remote");
        if (remote) remote.remove();

        // respawn placeholder
        if (window.spawnStrangerVideo) {
            setTimeout(() => {
                window.spawnStrangerVideo();
            }, 1000);
        }
    });
}

// ============================
// LAYOUT BUTTON (simple toggle demo)
// ============================

let compactMode = false;

if (layoutBtn) {
    layoutBtn.addEventListener("click", () => {

        compactMode = !compactMode;

        if (compactMode) {
            videoCanvas.style.transform = "scale(0.9)";
            videoCanvas.style.transition = "0.3s";
        } else {
            videoCanvas.style.transform = "scale(1)";
        }

        if (window.addSystemMessage) {
            window.addSystemMessage(
                compactMode ? "📐 Compact layout enabled" : "📐 Normal layout restored"
            );
        }
    });
}

// ============================
// GLOBAL KEYBOARD SHORTCUTS
// ============================

document.addEventListener("keydown", (e) => {

    // N = next stranger
    if (e.key.toLowerCase() === "n") {
        if (window.startSearch) window.startSearch();
    }

    // L = layout toggle
    if (e.key.toLowerCase() === "l") {
        layoutBtn.click();
    }
});
