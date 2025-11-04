"use strict";
const express = require('express');
const dotenv = require('dotenv');
const app = express();
const port = process.env.API_PORT || 9091

app.get("/", (req, res) => {
    res.json({
        status: "ok",
        msg: "GET / ENDPOINT"
    });
});

app.listen(port, function() {
    console.log(`Server is listening on port: ${port}`);
});