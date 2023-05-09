const express = require('express');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

const statesRouter = require('./routes/states');

const app = express();

app.get("/", (req, res) => {
    res.write("HTML PAGE");
    res.end(); 
});

app.use("/states", statesRouter);

// Error handeling middleware
app.all('*',(req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "/views", "/404.html"));
    } else if (req.accepts("json")) {
        req.json({err: "404 Not Found"});
    } else {
        res.type("txt").send("404 Not Found");
    }

    res.end();
});

app.use((err, req, res, next) => {
    console.log(err);
    res.sendFile(path.join(__dirname, "/views", "/404.html"));
    res.end();
});

app.listen(process.env.PORT | 3000, () => {
    console.log(`App is listening on http://localhost:${process.env.PORT | 3000}`);
});