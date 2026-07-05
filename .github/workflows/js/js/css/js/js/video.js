const canvas = document.getElementById("videoCanvas");

let localStream = null;

// ============================
// INIT VIDEO SYSTEM
// ============================

window.addEventListener("load", initVideoSystem);

async function initVideoSystem() {

    await setupLocalVideo();
    createRemoteVideoPlaceholder();

}

// ============================
// LOCAL VIDEO
// ============================

async function setupLocalVideo() {

    const localVideo = document.createElement("video");
    localVideo.autoplay = true;
    localVideo.muted = true;
    localVideo.playsInline = true;

    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        localVideo.srcObject = localStream;

    } catch (err) {
        console.warn("Camera/mic blocked or unavailable", err);
    }

    const card = createVideoCard("You", "local");
    card.querySelector(".videoBody").appendChild(localVideo);

    canvas.appendChild(card);
}

// ============================
// REMOTE VIDEO (PLACEHOLDER)
// ============================

function createRemoteVideoPlaceholder() {

    const card = createVideoCard("Stranger", "remote");

    const placeholder = document.createElement("div");
    placeholder.className = "remotePlaceholder";

    placeholder.innerText = "Waiting for stranger...";

    placeholder.style.color = "#aaa";
    placeholder.style.display = "flex";
    placeholder.style.alignItems = "center";
    placeholder.style.justifyContent = "center";
    placeholder.style.height = "100%";

    card.querySelector(".videoBody").appendChild(placeholder);

    canvas.appendChild(card);
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

// ============================
// REPLACE STRANGER (later matchmaking)
// ============================

window.spawnStrangerVideo = function () {

    const existing = document.querySelector(".videoCard.remote");
    if (existing) existing.remove();

    const card = createVideoCard("Stranger", "remote");

    const video = document.createElement("video");
    video.autoplay = true;
    video.playsInline = true;

    card.querySelector(".videoBody").appendChild(video);

    canvas.appendChild(card);

    return card;
};
