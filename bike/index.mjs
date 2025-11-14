"use strict";
import express from "express";
import "dotenv";

const app = express();

const port = process.env.BIKE_PORT || 7071;

app.get("/", (req, res) => {
  res.send({
    status: 200,
    msg: "Bike OK",
  });
});

app.listen(port, function () {
  console.log(`Listening on port: ${port}`);
});
