let peerConnection;
let localStreamGlobal;
let remoteStream;

// STUN server (required for WebRTC)
const servers = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
};

// ============================
// INIT WEBRTC SYSTEM
// ============================

window.initCallSystem = async function () {

    try {

        localStreamGlobal = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        const localVideo = document.querySelector(".videoCard.local video");

        if (localVideo) {
            localVideo.srcObject = localStreamGlobal;
        }

        setupPeer();

    } catch (err) {
        console.error("Camera/mic error:", err);
    }
};

// ============================
// CREATE PEER CONNECTION
// ============================

function setupPeer() {

    peerConnection = new RTCPeerConnection(servers);

    remoteStream = new MediaStream();

    const remoteVideo = document.querySelector(".videoCard.remote video");

    if (remoteVideo) {
        remoteVideo.srcObject = remoteStream;
    }

    // add local tracks
    localStreamGlobal.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStreamGlobal);
    });

    // receive remote tracks
    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track);
        });
    };

    // ICE candidates (normally sent to server)
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            console.log("ICE candidate:", event.candidate);
        }
    };

    createOffer();
}

// ============================
// CREATE OFFER (FAKE LOCAL TEST)
// ============================

async function createOffer() {

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    console.log("Offer created:", offer);

    // simulate "server loopback" for testing
    simulateAnswer(offer);
}

// ============================
// SIMULATED ANSWER (FAKE STRANGER)
// ============================

async function simulateAnswer(offer) {

    const fakePeer = new RTCPeerConnection(servers);

    fakePeer.ontrack = (event) => {
        // ignore (we already show local stream as test)
    };

    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    });

    stream.getTracks().forEach(track => {
        fakePeer.addTrack(track, stream);
    });

    await fakePeer.setRemoteDescription(offer);

    const answer = await fakePeer.createAnswer();
    await fakePeer.setLocalDescription(answer);

    await peerConnection.setRemoteDescription(answer);

    console.log("Fake connection established");
}

// ============================
// START CALL HOOK
// ============================

window.startRealCall = function () {
    window.initCallSystem();
};
