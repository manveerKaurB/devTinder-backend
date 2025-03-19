const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
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

// get all users 
userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        // avoid certains cards - his own card, card of his conenction where status is interested, ignored, accepted
        // i.e. user sees all cards except:
        // 0. his own card
        // 1. his connections (i.e. status = accepted)
        // 2. ignored people (i.e. status = ignored or rejected)
        // 3. already sent the connection (i.e. status = interested)


        // connection request that I have (sent or received)
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id },
            ]
        }).select("fromUserId toUserId");
        // }).select("fromUserId toUserId").populate("fromUserId", "firstName").populate("toUserId", "firstName");

        const hideUsersFromFeed = new Set();
        connectionRequest.forEach((row) => {
            hideUsersFromFeed.add(row.fromUserId.toString());
            hideUsersFromFeed.add(row.toUserId.toString());
        });
        const usersFeed = await User.find({
            $and: [
               {_id: { $nin: Array.from(hideUsersFromFeed) }},
               { _id: { $ne: loggedInUser._id } }
            ] 
        }).select(USER_SAFE_DATA);
        // select is used to send only specific fields instead of whole object
        res.send(usersFeed);
    }
    catch(err) {
        return res.status(400).json({message: "Error fetching users" + err.message});
    }
});

module.exports = userRouter;