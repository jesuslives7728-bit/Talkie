let peerConnection;
let localStream;
let remoteStream;

let currentSocket = null;
let currentRoom = null;
let isInitiator = false;

const servers = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
    ]
};

// ============================
// ENTRY POINT
// ============================

window.startWebRTC = async function (socket, room, initiator) {

    cleanupCall(); // IMPORTANT FIX

    currentSocket = socket;
    currentRoom = room;
    isInitiator = initiator;

    await startLocalStream();
    createPeerConnection();
};

// ============================
// LOCAL STREAM
// ============================

async function startLocalStream() {

    localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    });

    const localVideo = document.querySelector(".videoCard.local video");

    if (localVideo) {
        localVideo.srcObject = localStream;
    }
}

// ============================
// PEER CONNECTION
// ============================

function createPeerConnection() {

   
