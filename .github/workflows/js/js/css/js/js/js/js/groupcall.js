let peerConnection;
let localStream;
let remoteStream;

let currentSocket = null;
let currentRoom = null;
let isInitiator = false;

const servers = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
};

// ============================
// ENTRY FROM MATCHMAKING
// ============================

window.startWebRTC = async function (socket, room, initiator) {

    currentSocket = socket;
    currentRoom = room;
    isInitiator = initiator;

    await startLocalStream();
    createPeerConnection();
};

// ============================
// GET CAMERA
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
// PEER SETUP
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

    // ICE → server
    peerConnection.onicecandidate = (event) => {
        if (event.candidate && currentSocket) {
            currentSocket.emit("ice-candidate", {
                room: currentRoom,
                candidate: event.candidate
            });
        }
    };

    // listen ICE from server
    currentSocket.on("ice-candidate", async (candidate) => {
        try {
            await peerConnection.addIceCandidate(candidate);
        } catch (e) {
            console.log("ICE error", e);
        }
    });

    // offer/answer flow
    setupSignaling();

    // initiator creates offer
    if (isInitiator) {
        createOffer();
    }
}

// ============================
// SIGNAL HANDLERS
// ============================

function setupSignaling() {

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
