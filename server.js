const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});


// ============================
// FIX: SERVE FRONTEND (IMPORTANT)
// ============================
// This fixes "Cannot GET /"
app.use(express.static(__dirname));


// ============================
// STATE
// ============================

let waitingQueue = [];
const socketRoomMap = new Map();


// ============================
// HELPERS
// ============================

function removeFromQueue(socketId) {
    waitingQueue = waitingQueue.filter(s => s.id !== socketId);
}

function leaveRoom(socket) {
    const room = socketRoomMap.get(socket.id);

    if (room) {
        socket.leave(room);
        socket.to(room).emit("partner-disconnected");
        socketRoomMap.delete(socket.id);
    }

    return room;
}


// ============================
// SOCKET.IO
// ============================

io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    // ============================
    // FIND STRANGER
    // ============================

    socket.on("find-stranger", () => {

        removeFromQueue(socket.id);

        if (socketRoomMap.has(socket.id)) return;

        if (waitingQueue.length > 0) {

            const partner = waitingQueue.shift();

            if (!partner || !partner.connected) {
                socket.emit("waiting");
                return;
            }

            const room = `${partner.id}#${socket.id}`;

            partner.join(room);
            socket.join(room);

            socketRoomMap.set(socket.id, room);
            socketRoomMap.set(partner.id, room);

            partner.emit("matched", {
                room,
                initiator: true
            });

            socket.emit("matched", {
                room,
                initiator: false
            });

            console.log("Matched:", room);

        } else {
            waitingQueue.push(socket);
            socket.emit("waiting");
        }
    });

    // ============================
    // NEXT STRANGER
    // ============================

    socket.on("next-stranger", () => {

        leaveRoom(socket);
        removeFromQueue(socket.id);

        if (!waitingQueue.find(s => s.id === socket.id)) {
            waitingQueue.push(socket);
        }

        socket.emit("waiting");
    });

    // ============================
    // WEBRTC SIGNALING
    // ============================

    socket.on("offer", ({ room, offer }) => {
        socket.to(room).emit("offer", offer);
    });

    socket.on("answer", ({ room, answer }) => {
        socket.to(room).emit("answer", answer);
    });

    socket.on("ice-candidate", ({ room, candidate }) => {
        socket.to(room).emit("ice-candidate", candidate);
    });

    // ============================
    // DISCONNECT CLEANUP
    // ============================

    socket.on("disconnect", () => {

        console.log("User disconnected:", socket.id);

        removeFromQueue(socket.id);
        leaveRoom(socket);
    });
});


// ============================
// START SERVER (RENDER SAFE)
// ============================

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
