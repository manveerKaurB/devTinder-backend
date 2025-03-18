const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"
// get all pensing connection requests for loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const pendingRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA); 
        // }).populate("fromUserId", ["firstName", "lastName"])
        // }).populate("fromUserId", "firstName lastName")
        if(!pendingRequests) {
            return res.status(404).json({ message: "No pending requests found" });
        }
        res.status(200).json({message: "connections received successfully" , pendingRequests});
    }
    catch(err) {
        return res.status(400).json({msg: "Error" + err.message});
    }
})

// get all accepted connection requests
userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted"}
        ]}).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA)
        // }).populate("fromUserId", "firstName lastName")

        if(!connectionRequests) {
            return res.status(404).json({ message: "No connection requests found" });
        }

        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.equals(loggedInUser._id)) {
                return row.toUserId;
            }
            else if(row.toUserId._id.equals(loggedInUser._id)) {
                return row.fromUserId;
            }
        });

        res.status(200).json({message: "connections received successfully" , data});
    }
    catch(err) {
        return res.status(400).json({msg: "Error" + err.message});
    }
});

module.exports = userRouter;