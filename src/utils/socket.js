const socket = require("socket.io");
const crypto = require("crypto");
const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join("_")).digest("hex");
}
const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: ["http://localhost:5173"]
        }
    })

    // when we receive connection from client
    io.on("connection", (socket) => {
        console.log("Client connected");
        // handle events
        socket.on("joinChat", ({firtsName, userId, targetUserId}) => {
1           // create room, i.e. unique id for every chat
            const roomId = getSecretRoomId(userId, targetUserId);
            console.log(firtsName + " joined room: " + roomId);
            socket.join(roomId);
        });
        socket.on("sendMessage", ({firstName, userId, targetUserId, text}) => {
            // send meesgae to roomId
            const roomId = getSecretRoomId(userId, targetUserId);
            // server emitting the message
            io.to(roomId).emit("messageReceived", {
                firstName, 
                text
            })
        });
        socket.on("disconnect", (data) => {

        });
    })
}

module.exports = initializeSocket;