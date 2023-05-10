const express = require('express');
const path = require('path');
const db = require('./model/db');
const statesRouter = require('./routes/states');

require('dotenv').config();

db.connectDB();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.write("HTML PAGE");
    res.end(); 
});

app.use("/states", statesRouter);

app.use(express.urlencoded({ extended: false}));

// Error handling middleware
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