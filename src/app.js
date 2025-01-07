const express = require("express");
const app = express();
app.listen(3000, ()=> {
    console.log("Server is successfully running on port 3000");
});

// app.use("/userDetails", (req, res) => {
//    console.log("route handler 1");
//     res.send("respone from route handler 1");
// }, (req, res) => {
//     console.log("route handler 2");
//     res.send("respone from route handler 2");
// });

app.use("/userDetails0", (req, res) => {
    console.log("route handler 1");
    // res.send("respone from route handler 1");
 }, (req, res) => {
     console.log("route handler 2");
     res.send("respone from route handler 2");
 });

 app.use("/userDetails", (req, res, next) => {
    console.log("route handler 1");
    // res.send("respone from route handler 1");
    next();
 }, (req, res) => {
     console.log("route handler 2");
     res.send("respone from route handler 2");
 });

 app.use("/userDetails1", (req, res, next) => {
    console.log("route handler 1");
    res.send("respone from route handler 1");
    next();
 }, (req, res) => {
     console.log("route handler 2");
     res.send("respone from route handler 2");
 });

 app.use("/userDetails2", (req, res, next) => {
    console.log("route handler 1");
    next();
    res.send("respone from route handler 1");
 }, (req, res) => {
     console.log("route handler 2");
     res.send("respone from route handler 2");
 });


 app.use("/userDetails3", (req, res, next) => {
    console.log("route handler 1");
    next();
 });

 app.use("/userDetails4", (req, res, next) => {
    console.log("route handler 1");
 });


 app.use("/userDetails5", [(req, res, next) => {
    console.log("route handler 1");
    next();
    res.send("respone from route handler 1");
 }, (req, res) => {
     console.log("route handler 2");
     res.send("respone from route handler 2");
 }]);

 app.use("/userDetails6", [(req, res, next) => {
    console.log("route handler 1");
    next();
    res.send("respone from route handler 1");
 }], (req, res) => {
     console.log("route handler 2");
     res.send("respone from route handler 2");
 });

 app.use("/userDetails7", (req, res, next) => {
    console.log("route handler 1");
    next();
 });
 app.use("/userDetails7", (req, res, next) => {
    console.log("route handler 2");
    res.send("respone from route handler 2");
 });

app.get("/user/:userID/:password", (req,res) => {
    console.log(req.params)
    res.send(`hello from user, userId ${req.params.userID}, password ${req.params.password}`);
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

app.get("/ab?c", (req,res) => {
    res.send("hello from abc or ac");
});

app.get("/de+f", (req,res) => {
    res.send("hello from def or deef or deeeeeef etc.");
});

app.get("/xy*z", (req,res) => {
    res.send("hello from xyAnythingz");
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