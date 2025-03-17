const express = require("express");
const { validateSignUpData } = require("../src/utils/Validation");
const bcrypt = require("bcrypt");
const User = require("../src/models/user");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        // validation of data
        validateSignUpData(req);
        const {firstName, lastName, emailId, password} = req.body;
        // encryption of password
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({firstName, lastName, emailId, password: passwordHash});
        await user.save();
        res.send("User added successfully");
    } catch(err) {
        res.status(400).send("Error saving the user" + err.message);
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const {emailId, password} = req.body;
        // validation of data
        const user = await User.findOne({emailId});
        if(!user) {
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            const token = await user.getJWT();
            res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000)});
            res.send("User logged in successfully");
        }
        else {
            throw new Error("Invalid credentials");
        }

    } catch(err) {
        res.status(400).send("Error: " + err.message);
    }
})


module.exports = authRouter;