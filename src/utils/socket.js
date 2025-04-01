const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
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
        socket.on("sendMessage", async ({firstName, lastName, userId, targetUserId, text}) => {
            try {
                // send meesgae to roomId
                const roomId = getSecretRoomId(userId, targetUserId);
                // check if user it and target user id are friends
                const isFriend = await Chat.findOne({
                    $or: [
                        {fromUserId: userId, toUserId: targetUserId, status: "accepted"},
                        {fromUserId: targetUserId, toUserId: userId, status: "accepted"}
                    ]
                });
                if (!isFriend) {
                    return res.status(401).json({error: "Users are not friends!"});
                }
                // save message to db 
                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId] }
                })
                // fresh chat, create new chat, if there is no existing chat
                if(!chat) {
                    chat = new Chat({
                        participants: [ userId, targetUserId ],
                        messages: []
                    })
                }
                // push messages
                chat.messages.push({
                    senderId: userId,
                    text: text
                })
                await chat.save();

                // server emitting the message
                io.to(roomId).emit("messageReceived", {
                    firstName, 
                    lastName,
                    text
                })
            }
            catch(err) {
                console.log(err);
            }
        });

        socket.on("disconnect", (data) => {

        });
    })
}

module.exports = initializeSocket;