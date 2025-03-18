const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

// get all pensing connection requests for loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const pendingRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName"])
        // }).populate("fromUserId", "firstName lastName")
        if(!pendingRequests) {
            return res.status(404).json({ message: "No pending requests found" });
        }
        res.status(200).json({message: "Data send successfully" , pendingRequests});
    }
    catch(err) {
        return res.status(400).json({msg: "Error" + err.message});
    }
})

module.exports = userRouter;