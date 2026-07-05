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

// waiting user queue
let waitingUser = null;

// ============================
// SOCKET CONNECTION
// ============================

io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    // ============================
    // FIND STRANGER MATCHMAKING
    // ============================

    socket.on("find-stranger", () => {

        if (waitingUser) {

            // pair users into a room
            const room = `${waitingUser.id}#${socket.id}`;

            socket.join(room);
            waitingUser.join(room);

            socket.emit("matched", { room, initiator: false });
            waitingUser.emit("matched", { room, initiator: true });

            waitingUser = null;

            console.log("Matched 2 users:", room);

        } else {

            waitingUser = socket;
            socket.emit("waiting");
        }
    });

    // ============================
    // WEBRTC SIGNAL RELAY
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
    // DISCONNECT HANDLING
    // ============================

    socket.on("disconnect", () => {

        if (waitingUser && waitingUser.id === socket.id) {
            waitingUser = null;
        }

        console.log("User disconnected:", socket.id);
    });
});

// ============================
// START SERVER
// ============================

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
