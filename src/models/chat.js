const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        text: {
            type: String,
            required: true
        }
}, {timestamps: true});
const ChatSchema = new mongoose.Schema({
        participants: [
            {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
        ],
        messages: [messagesSchema]
});

module.exports = mongoose.model("Chat", ChatSchema);