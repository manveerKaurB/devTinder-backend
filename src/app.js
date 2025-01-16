const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: 'Manveer',
        lastName: 'Kaur',
        emailId: 'mk@gmail.com',
        password: 'mk@09',
        age: 26,
        gender: 'Female'
    })
    try {
        await user.save();
        res.send("User added successfully");
    } catch(err) {
        res.status(400).send("Error saving the user" + err.message);
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
