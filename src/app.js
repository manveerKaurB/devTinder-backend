const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/Validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
    try {
        res.send(req.user);
    }
    catch(err) {
        res.status(400).send("Error: " + err.message);
    }
})

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    try{
        const user = req.user;
        res.send(user.firstName + " sent the connection requst!!");
    }
    catch(err) {
        res.status(400).send("Error: " + err.message);
    }
})

// // fetch user by email
// app.get("/user", async (req, res) => {
//     try{
//         const userEmail = req.body.emailId;
//         const user = await User.findOne({emailId: userEmail});
//         if(!user) {
//             res.status(404).send("User not found");
//         }
//         else {
//             res.send(user);
//         }
//         // const user = await User.find({emailId: userEmail});
//         // if(user.length === 0) {
//         //     res.status(404).send("User not found");
//         // }
//         // else {
//         //     res.send(user);
//         // }
//     }
//     catch(err) {
//         res.status(400).send("Something went wrong");
//     }
// })
// //Feed api - get all the users from the database
// app.get("/feed", async (req, res) => {
//     try {
//         const user = await User.find();
//         if(user.length === 0) {
//             res.status(404).send("User not found");
//         }
//         else {
//             res.send(user);
//         }
//     }
//     catch(err) {
//         res.status(400).send("Something went wrong");
//     }
// })

// // delete user
// app.delete("/user", async (req, res) => {
//     try {
//         const userId = req.body.userId;
//         const user = await User.findByIdAndDelete(userId);
//         res.send("User deleted successfully");
//     }
//     catch {
//         res.status(400).send("Something went wrong");
//     }
// });

// // update data of user 
// app.patch("/user/:userId", async (req, res) => {
//     try {
//         const userId = req.params?.userId;
//         const data = req.body;
//         const ALLOWED_UPDATES = ["photoUrl", "about", "skills", "gender", "age", "password"];
//         const isUpdateAllowed = Object.keys(data).every(key => ALLOWED_UPDATES.includes(key));
//         if(!isUpdateAllowed) {
//             throw new Error("Invalid update");
//         }
//         if(data?.skills?.length > 5) {
//             throw new Error("Skills cannot be more that 5");
//         }
//         await User.findByIdAndUpdate(userId, data, {runValidators: true});
//         res.send("User updated successfully");
//     } catch(err) {
//         res.status(400).send("Update failed" + err.message);
//     }
// })
// // update data of user by emailId
// app.patch("/userByEmail", async (req, res) => {
//     try {
//         await User.findOneAndUpdate({emailId: req.body.emailId}, req.body);
//         res.send("User updated successfully");
//     } catch(err) {
//         res.status(400).send("Update failed" + err.message);
//     }
// })

connectDB()
.then(() => {
    console.log("Database connection established ....");
    app.listen(3000, ()=> {
        console.log("Server is successfully running on port 3000");
    });
})
.catch((err) => {
    console.log("Error connecting to database");
})
