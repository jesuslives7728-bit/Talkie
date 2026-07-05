const findStrangerBtn = document.querySelector(".primaryButton");
const addPeopleBtn = document.querySelectorAll(".secondaryButton")[0];
const inviteFriendsBtn = document.querySelectorAll(".secondaryButton")[1];

const strangerFooterBtn = document.querySelector(".controls button:nth-child(6)");
const layoutBtn = document.querySelector(".controls button:nth-child(7)");

const videoCanvas = document.getElementById("videoCanvas");

// socket reference (from matchmaking.js)
const socket = window.socket;

// ============================
// FIND STRANGER
// ============================

findStrangerBtn.addEventListener("click", () => {

    if (socket) {
        socket.emit("find-stranger");
    }

});

// ============================
// ADD PEOPLE (placeholder)
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
// NEXT STRANGER (REAL)
// ============================

if (strangerFooterBtn) {

    strangerFooterBtn.addEventListener("click", () => {

        if (socket) {
            socket.emit("next-stranger");
        }

        if (window.addSystemMessage) {
            window.addSystemMessage("🔄 Connecting to next stranger...");
        }

    });
}

// ============================
// LAYOUT TOGGLE
// ============================

let compactMode = false;

if (layoutBtn) {

    layoutBtn.addEventListener("click", () => {

        compactMode = !compactMode;

        videoCanvas.style.transform = compactMode
            ? "scale(0.9)"
            : "scale(1)";

        videoCanvas.style.transition = "0.3s";

        if (window.addSystemMessage) {
            window.addSystemMessage(
                compactMode
                    ? "📐 Compact layout enabled"
                    : "📐 Normal layout restored"
            );
        }
    });
}

// ============================
// KEYBOARD SHORTCUTS
// ============================

document.addEventListener("keydown", (e) => {

    if (e.key.toLowerCase() === "n") {
        socket?.emit("next-stranger");
    }

    if (e.key.toLowerCase() === "l") {
        layoutBtn.click();
    }
});
