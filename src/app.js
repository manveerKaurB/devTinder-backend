const express = require("express");
const { connectDB } = require("./config/database");
const app = express();

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
