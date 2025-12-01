"use strict";
import express, { json } from "express";
import "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.mjs";

const app = express();
const port = process.env.API_PORT || 9091;
const version = process.env.API_VERSION;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.set("json spaces", 2);

// ----- ROUTES -----
app.use(`/api/${version}/auth`, authRoutes);

app.get(`/${version}/`, (req, res) => {
  res.json({
    status: "ok",
    msg: "GET / ENDPOINT",
  });
});

app.listen(port, function () {
  console.log(`Server is listening on port: ${port} .`);
});
