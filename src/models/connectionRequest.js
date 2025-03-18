const mongoose = require("mongoose");
const User = require("./user");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User
    },
    status: {
        type: String,
        enum : {
            values : ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        },
        required: true
    }
}, {
    timestamps: true
});

connectionRequestSchema.index({
    fromUserId: 1,
    toUserId: 1,
});
connectionRequestSchema.pre("save", function(next) {
    const connectionRequestInputs = this;
    if(connectionRequestInputs.fromUserId.equals(connectionRequestInputs.toUserId)){
        throw new Error("You can't send a connection request to yourself");
    }
    next();
})
const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequest;  //export the model