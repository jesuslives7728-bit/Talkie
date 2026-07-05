const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*" }
});

// ============================
// STATE
// ============================

let waitingQueue = [];
let socketRoomMap = new Map();

// ============================
// HELPERS
// ============================

function removeFromQueue(socketId) {
    waitingQueue = waitingQueue.filter(s => s.id !== socketId);
}

function getPartnerRoom(socketId) {
    return socketRoomMap.get(socketId);
}

// ============================
// SOCKET CONNECTION
// ============================

io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    // ============================
    // FIND STRANGER
    // ============================

    socket.on("find-stranger", () => {

        removeFromQueue(socket.id);

        // prevent double matchmaking
        if (socketRoomMap.has(socket.id)) return;

        if (waitingQueue.length > 0) {

            const partner = waitingQueue.shift();

            if (!partner || partner.disconnected) {
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

        const room = socketRoomMap.get(socket.id);

        if (room) {
            socket.to(room).emit("partner-disconnected");

            socket.leave(room);
            socketRoomMap.delete(socket.id);
        }

        removeFromQueue(socket.id);

        waitingQueue.push(socket);
        socket.emit("waiting");
    });

    // ============================
    // WEBRTC RELAY
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
    // DISCONNECT
    // ============================

    socket.on("disconnect", () => {

        console.log("User disconnected:", socket.id);

        removeFromQueue(socket.id);

        const room = socketRoomMap.get(socket.id);

        if (room) {
            socket.to(room).emit("partner-disconnected");
            socketRoomMap.delete(socket.id);
        }
    });
});

// ============================
// START SERVER
// ============================

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
