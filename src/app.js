const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());
app.post("/signup", async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save();
        res.send("User added successfully");
    } catch(err) {
        res.status(400).send("Error saving the user" + err.message);
    }
})

// fetch user by email
app.get("/user", async (req, res) => {
    try{
        const userEmail = req.body.emailId;
        const user = await User.findOne({emailId: userEmail});
        if(!user) {
            res.status(404).send("User not found");
        }
        else {
            res.send(user);
        }
        // const user = await User.find({emailId: userEmail});
        // if(user.length === 0) {
        //     res.status(404).send("User not found");
        // }
        // else {
        //     res.send(user);
        // }
    }
    catch(err) {
        res.status(400).send("Something went wrong");
    }
})
//Feed api - get all the users from the database
app.get("/feed", async (req, res) => {
    try {
        const user = await User.find();
        console.log(user);
        if(user.length === 0) {
            res.status(404).send("User not found");
        }
        else {
            res.send(user);
        }
    }
    catch(err) {
        res.status(400).send("Something went wrong");
    }
})

// delete user
app.delete("/user", async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }
    catch {
        res.status(400).send("Something went wrong");
    }
});

// update data of user 
app.patch("/user", async (req, res) => {
    try {
        const userId = req.body.userId;
        await User.findByIdAndUpdate(userId, req.body, {runValidators: true});
        res.send("User updated successfully");
    } catch(err) {
        res.status(400).send("Update failed" + err.message);
    }
})
// update data of user by emailId
app.patch("/userByEmail", async (req, res) => {
    try {
        await User.findOneAndUpdate({emailId: req.body.emailId}, req.body);
        res.send("User updated successfully");
    } catch(err) {
        res.status(400).send("Update failed" + err.message);
    }
})

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
