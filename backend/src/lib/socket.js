import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// the socket server
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
});

export function getReceiverSocketId(userId) {
    // the map stores,  userId: SocketId;
    return userSocketMap[userId];
}

// used to store online users
// { userid: socketId }
const userSocketMap = {};  

io.on("connection", (socket) => {
    console.log("A user connected, ", socket.id);

    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id

    // Message Broadcast to every connected user
    //io.emit is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected, ", socket.id);
        delete userSocketMap[userId];
        // let everyone know a user has disconnected and update the map 
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };