const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfile, validateEditPasswordProfile } = require("../utils/Validation")
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        res.send(req.user);
    }
    catch(err) {
        res.status(400).send("Error: " + err.message);
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        // validate data
        if(!validateEditProfile(req)) {
            throw new Error("Invalid edit profile request");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);
        await loggedInUser.save(); // save the updated profile in db
        // res.send(loggedInUser?.firstName + " your profile update successfully");
        res.json({
            message: loggedInUser?.firstName + " your profile update successfully",
            data: loggedInUser
        })
    }
    catch(err) {
        res.status(400).send("Error: " + err.message);
    }
})

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        // validate data
        const isValidData = await validateEditPasswordProfile(req);
        console.log("isValidData" + isValidData);
        if(!isValidData) {
            throw new Error("Invalid edit profile password request");
        }
        const loggedInUser = req.user;
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        loggedInUser.password = hashedPassword;
        await loggedInUser.save(); // save the updated profile in db
        res.json({
            message: loggedInUser?.firstName + " your profile password update successfully",
        })
    }
    catch(err) {
        res.status(400).send("Error: " + err.message);
    }
})

module.exports = profileRouter;