const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const fromUserId = loggedInUser._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if(!allowedStatus.includes(status)) {
           return res.status(400).send("Invalid status type: " + status);
        }
        const toUser = await User.findById(toUserId);
        if(!toUser) {
            return res.status(404).send({message: "User not found!"});
        }
        // check if tehre is existing conection request from A to B or B to A
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        });

        if(existingConnectionRequest) {
            return res.status(400).send("connection request already exists ");
        }

        connectionRequest = new ConnectionRequest({fromUserId, toUserId, status});
        const data = await connectionRequest.save();
        res.send({
            message: req.user.firstName + " is " + status + " in " + toUser.firstName,
            data
        });
    }
    catch(err) {
        res.status(400).send("Error: " + err.message);
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user; // attached by userAuth
        const {status, requestId} = req.params;
        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)) {
           return res.status(400).send("Invalid status type: " + status);
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: 'interested'
        });
        if(!connectionRequest) {
            return res.status(404).send({message: "Connection request not found!"});
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            message: "connection request " + status,
            data
        })
        // komal => ankita
        // then logged in user should be ankita, as ankita would  be the one who is reviewing the request
        // so toUserId should be the loggedInUserId
        // if status is interested, then only receiver can accept/reject it. if its ignored there no way to accept/reject it.
        // loggedInId === toUserId
        // status === interested
        // requestId should be valid

    }
    catch(err) {
        res.status(400).send("Error: " + err.message);
    }
})

module.exports = requestRouter;