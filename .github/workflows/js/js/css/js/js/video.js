const canvas = document.getElementById("videoCanvas");

let localVideoEl = null;
let remoteVideoEl = null;

// ============================
// INIT VIDEO SYSTEM
// ============================

window.addEventListener("load", initVideoSystem);

function initVideoSystem() {
    setupLocalVideo();
    setupRemoteVideo();
}

// ============================
// LOCAL VIDEO SLOT
// ============================

async function setupLocalVideo() {

    localVideoEl = document.createElement("video");
    localVideoEl.autoplay = true;
    localVideoEl.muted = true;
    localVideoEl.playsInline = true;

    const card = createVideoCard("You", "local");

    card.querySelector(".videoBody").appendChild(localVideoEl);
    canvas.appendChild(card);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        localVideoEl.srcObject = stream;

        // expose for WebRTC
        window.localStreamForCall = stream;

    } catch (err) {
        console.warn("Camera blocked:", err);
    }
}

// ============================
// REMOTE VIDEO SLOT (IMPORTANT)
// ============================

function setupRemoteVideo() {

    remoteVideoEl = document.createElement("video");
    remoteVideoEl.autoplay = true;
    remoteVideoEl.playsInline = true;

    const card = createVideoCard("Stranger", "remote");

    const placeholder = document.createElement("div");
    placeholder.className = "remotePlaceholder";
    placeholder.innerText = "Waiting for stranger...";

    card.querySelector(".videoBody").appendChild(remoteVideoEl);
    card.querySelector(".videoBody").appendChild(placeholder);

    canvas.appendChild(card);

    // expose for WebRTC
    window.remoteVideoForCall = remoteVideoEl;
}

// ============================
// VIDEO CARD FACTORY
// ============================

function createVideoCard(name, type) {

    const card = document.createElement("div");
    card.classList.add("videoCard", type);

    card.style.position = "absolute";
    card.style.width = "260px";
    card.style.height = "180px";
    card.style.left = type === "local" ? "20px" : "300px";
    card.style.top = type === "local" ? "20px" : "120px";

    card.innerHTML = `
        <div class="videoHeader">
            <span>${name}</span>
        </div>

        <div class="videoBody"></div>
    `;

    return card;
}
