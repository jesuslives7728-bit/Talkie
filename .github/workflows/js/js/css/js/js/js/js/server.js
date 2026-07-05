const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// ============================
// STATE
// ============================

let waitingQueue = [];
let socketRoomMap = new Map();

// ============================
// SOCKET CONNECTION
// ============================

io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    // ============================
    // FIND STRANGER
    // ============================

    socket.on("find-stranger", () => {

        // avoid duplicates in queue
        waitingQueue = waitingQueue.filter(s => s.id !== socket.id);

        if (waitingQueue.length > 0) {

            const partner = waitingQueue.shift();

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
    // NEXT / REQUEUE HANDLING
    // ============================

    socket.on("next-stranger", () => {

        const room = socketRoomMap.get(socket.id);

        if (room) {
            socket.to(room).emit("partner-disconnected");
        }

        socket.leaveAll();
        socketRoomMap.delete(socket.id);

        waitingQueue.push(socket);
        socket.emit("waiting");
    });

    // ============================
    // WEBRTC RELAY (SAFE)
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

        // remove from queue
        waitingQueue = waitingQueue.filter(s => s.id !== socket.id);

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
