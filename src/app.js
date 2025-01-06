const express = require("express");
const app = express();
app.listen(3000, ()=> {
    console.log("Server is successfully running on port 3000");
});
app.use("/hello", (req,res) => {
    res.send("hello hello hello!");
});
app.use("/test", (req,res) => {
    res.send("test request handled!");
});
app.use("/", (req,res) => {
    res.send("hello from the server!");
});
// app.use((req,res) => {
//     res.send("hello from the server!");
// });