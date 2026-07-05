// ============================
// GROUP CALL SYSTEM (Talkie)
// ============================

let groupSocket = null;
let groupRoom = null;
let participants = [];

// ============================
// INIT FROM APP
// ============================

window.setGroupContext = function (socket, room) {
    groupSocket = socket;
    groupRoom = room;
};

// ============================
// ADD PEOPLE BUTTON (UI HOOK)
// ============================

const addPeopleBtn = document.querySelectorAll(".secondaryButton")[0];

if (addPeopleBtn) {
    addPeopleBtn.addEventListener("click", () => {
        startGroupCall();
    });
}

// ============================
// START GROUP CALL
// ============================

function startGroupCall() {

    // placeholder UI behavior for now
    const chat = document.querySelector(".chatMessages");

    if (chat) {
        const msg = document.createElement("div");
        msg.className = "message system";
        msg.textContent = "👥 Group call feature coming soon (multi-user rooms)";
        chat.appendChild(msg);
    }

    console.log("Group call triggered (placeholder)");

    // future: emit to server
    if (groupSocket && groupRoom) {
        groupSocket.emit("start-group-call", {
            room: groupRoom
        });
    }
}

// ============================
// INVITE FRIENDS BUTTON
// ============================

const inviteBtn = document.querySelectorAll(".secondaryButton")[1];

if (inviteBtn) {
    inviteBtn.addEventListener("click", () => {

        const chat = document.querySelector(".chatMessages");

        if (chat) {
            const msg = document.createElement("div");
            msg.className = "message system";
            msg.textContent = "📨 Invite system coming soon";
            chat.appendChild(msg);
        }

        console.log("Invite clicked (placeholder)");
    });
}

// ============================
// FUTURE: ADD PARTICIPANT
// ============================

window.addGroupParticipant = function (id) {
    if (!participants.includes(id)) {
        participants.push(id);
    }

    console.log("Participants:", participants);
};

// ============================
// FUTURE: REMOVE PARTICIPANT
// ============================

window.removeGroupParticipant = function (id) {
    participants = participants.filter(p => p !== id);

    console.log("Participants:", participants);
};
