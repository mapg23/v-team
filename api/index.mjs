"use strict";
import express, { json } from "express";
import "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.mjs";
import createUserRouter from './src/routes/userRoutes.mjs';

const app = express();
const port = process.env.API_PORT || 9091;
const version = process.env.API_VERSION;

app.use(cors({ origin: "*" }));
app.set("json spaces", 2);
app.use(express.json());

// Döljer servertypen (Express) för ökad säkerhet
app.disable('x-powered-by');

// Monterar routern
app.use(`/api/${version}`, createUserRouter());

app.get('/', (req, res) => {
    res.redirect(`/api/${version}/users`);
});


app.post('/telemetry', (req, res) => {
    console.log(req.body);
    res.json({ ok: true });
});

app.listen(port, function() {
    console.log(`Server is listening on port: ${port}`);
});
