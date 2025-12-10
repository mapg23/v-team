"use strict";
import express from "express";
import "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./src/routes/authRoutes.mjs";
import createUserRouter from './src/routes/userRoutes.mjs';
import createCityRouter from './src/routes/cityRoutes.mjs';
import createBikeRouter from './src/routes/bikeRoutes.mjs';
import startSimulator from './src/startSimulator.mjs';

const app = express();
const port = process.env.API_PORT || 9091;
const version = process.env.API_VERSION || 'v1';
const jwtSecret = process.env.JWT_SECRET;

// Middleware
app.use(cors({ origin: "*" }));
app.set("json spaces", 2);
app.use(express.json());
// Döljer Express-version
app.disable('x-powered-by');

// ----------- Routes
// app.use(`/api/${version}`, authRoutes);
app.use(`/api/${version}`, createUserRouter());
app.use(`/api/v1/auth`, authRoutes);
app.use(`/api/${version}`, createCityRouter());


// -------- Socket.io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Om godkänd klient
io.on("connection", (socket) => {
  console.log("connected!", socket.id)
});


app.get('/', (req, res) => {
    res.redirect(`/api/${version}/cities`);
});

app.use(`/api/${version}`, createBikeRouter(io));

// Telemetry route (WebSocket)
app.post('/telemetry', (req, res) => {
    const bikes = req.body.bikes || null;

    if (!bikes) {
        return res.status(400).json({ error: 'No bikes' });
    }

    io.emit('bikes', bikes);
});

// Startar server med Socket.IO
server.listen(port, async () => {
    console.log(`Server is listening on port: ${port}`);

    // Här startar vi simulatorn direkt när servern är uppe
    await startSimulator();
});
