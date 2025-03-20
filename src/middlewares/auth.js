const jwt = require('jsonwebtoken');
const User = require("../models/user");
const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) {
            return res.status(401).json({error: "Please authenticate"});
        }
        const decodedMessage = await jwt.verify(token, "Dev@Tinder67#");
        const user = await User.findById(decodedMessage._id);
        if(!user) {
            throw new Error("User does not exist");
        }
        else{
            req.user = user;
            next();
        }
    }
    catch(err) {
        res.status(400).send("Error: " + err.message);
    }
};

module.exports = { userAuth };