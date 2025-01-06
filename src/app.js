const express = require("express");
const app = express();
app.listen(3000, ()=> {
    console.log("Server is successfully running on port 3000");
});

app.get("/user", (req,res) => {
    res.send({"firstName": "Manveer", "lastName": "Kaur"});
});

app.post("/user", (req,res) => {
    console.log("Save data to the database");
    res.send("Data successfully saved to the database.");
});

app.delete("/user", (req,res) => {
    console.log("Delete data from the database");
    res.send("Data deleted successfully.");
});

app.use("/hello", (req,res) => {
    res.send("hello hello hello!");
});
app.use("/test", (req,res) => {
    res.send("test request handled!");
});
// app.use("/", (req,res) => {
//     res.send("hello from the server!");
// });
// app.use((req,res) => {
//     res.send("hello from the server!");
// });