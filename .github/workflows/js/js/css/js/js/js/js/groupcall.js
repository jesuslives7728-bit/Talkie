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

    cleanupCall(); // reset old session safely

    currentSocket = socket;
    currentRoom = room;
    isInitiator = initiator;

    await startLocalStream();
    createPeerConnection();
};

// ============================
// CLEANUP (VERY IMPORTANT)
// ============================

function cleanupCall() {

    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }

    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }

    remoteStream = null;

    if (currentSocket) {
        currentSocket.off("offer");
        currentSocket.off("answer");
        currentSocket.off("ice-candidate");
        currentSocket.off("partner-disconnected");
    }

    currentSocket = null;
    currentRoom = null;
    isInitiator = false;
}

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

    peerConnection = new RTCPeerConnection(servers);

    remoteStream = new MediaStream();

    const remoteVideo = document.querySelector(".videoCard.remote video");

    if (remoteVideo) {
        remoteVideo.srcObject = remoteStream;
    }

    // add local tracks
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    // receive remote tracks
    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track);
        });
    };

    // send ICE candidates to server
    peerConnection.onicecandidate = (event) => {
        if (event.candidate && currentSocket) {
            currentSocket.emit("ice-candidate", {
                room: currentRoom,
                candidate: event.candidate
            });
        }
    };

    setupSignaling();

    if (isInitiator) {
        createOffer();
    }
}

// ============================
// SIGNALING
// ============================

function setupSignaling() {

    if (!currentSocket) return;

    currentSocket.on("offer", async (offer) => {

        await peerConnection.setRemoteDescription(offer);

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        currentSocket.emit("answer", {
            room: currentRoom,
            answer
        });
    });

    currentSocket.on("answer", async (answer) => {
        await peerConnection.setRemoteDescription(answer);
    });

    currentSocket.on("ice-candidate", async (candidate) => {
        try {
            if (peerConnection) {
                await peerConnection.addIceCandidate(candidate);
            }
        } catch (err) {
            console.log("ICE error:", err);
        }
    });

    currentSocket.on("partner-disconnected", () => {
        cleanupCall();
    });
}

// ============================
// CREATE OFFER
// ============================

async function createOffer() {

    const offer = await peerConnection.createOffer();

    await peerConnection.setLocalDescription(offer);

    currentSocket.emit("offer", {
        room: currentRoom,
        offer
    });
}
