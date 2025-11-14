"use strict";
import express from 'express';
import 'dotenv';

const app = express();
const port = process.env.API_PORT || 9091
const version = process.env.API_VERSION;

app.get(`/${version}/`, (req, res) => {
    res.json({
        status: "ok",
        msg: "GET / ENDPOINT"
    });
});

app.listen(port, function() {
    console.log(`Server is listening on port: ${port}`);
});