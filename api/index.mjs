"use strict";
import express from "express";
import "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

// import authRoutes from "./src/routes/authRoutes.mjs";
import createUserRouter from './src/routes/userRoutes.mjs';
import createCityRouter from './src/routes/cityRoutes.mjs';
import createBikeRouter from './src/routes/bikeRoutes.mjs';
import startSimulator from './src/startSimulator.mjs';

const app = express();
const port = process.env.API_PORT || 9091;
const version = process.env.API_VERSION || 'v1';

// Middleware
app.use(cors({ origin: "*" }));
app.set("json spaces", 2);
app.use(express.json());
// Döljer Express-version
app.disable('x-powered-by');

// app.use(`/api/${version}`, authRoutes);
app.use(`/api/${version}`, createUserRouter());
app.use(`/api/${version}`, createCityRouter());


app.get('/', (req, res) => {
    res.redirect(`/api/${version}/cities`);
});

// HTTP och Socket.IO server
const httpServer = createServer(app);

export const io = new Server(httpServer, {
    cors: { origin: "*" }
});

app.use(`/api/${version}`, createBikeRouter());

// Telemetry route (WebSocket)
app.post('/telemetry', (req, res) => {
    const bikes = req.body.bikes || null;

    if (!bikes) {
        return res.status(400).json({ error: 'No bikes' });
    }

    io.emit('bikes', bikes);
});

// Startar server med Socket.IO
httpServer.listen(port, async () => {
    console.log(`Server is listening on port: ${port}`);

    // Här startar vi simulatorn direkt när servern är uppe
    await startSimulator();
});
