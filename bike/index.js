"use strict";

const express = require('express');
const dotenv = require('dotenv');
const app = express();

const port = process.env.BIKE_PORT || 7071;



app.get('/', (req, res) => {
    res.send({
        status: 200,
        msg: "Bike"
    })
});

app.listen(port, function () {
    console.log(`Listening on port: ${port}`);
});