"use strict";
import express from "express";
import "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./src/routes/authRoutes.mjs";
import createUserRouter from "./src/routes/userRoutes.mjs";
import createCityRouter from "./src/routes/cityRoutes.mjs";
import createBikeRouter from "./src/routes/bikeRoutes.mjs";
import createStationRouter from "./src/routes/stationRoutes.mjs";
import createParkingRouter from "./src/routes/parkingRoutes.mjs";
import startSimulator from "./src/startSimulator.mjs";
import stopSimulator from "./src/stopSimulator.mjs";
import tripRoutes from "./src/routes/tripRoutes.mjs";
import paymentRoutes from "./src/routes/paymentRoutes.mjs";
import stripeWebhookRoute from "./src/routes/stripeWebhookRoute.mjs";

const app = express();
const port = process.env.API_PORT || 9091;
const version = process.env.API_VERSION || "v1";

// Middleware
app.use(cors({ origin: "*" }));

// Must be defined before express.JSON, stripe demands RAW response for webhook.
app.use(`/api/${version}/payments`, stripeWebhookRoute);

app.set("json spaces", 2);
app.use(express.json());
// Döljer Express-version
app.disable("x-powered-by");

// ----------- Routes
// app.use(`/api/${version}`, authRoutes);
app.use(`/api/${version}`, createUserRouter());
app.use(`/api/v1/auth`, authRoutes);
app.use(`/api/${version}`, createCityRouter());
app.use(`/api/${version}`, createBikeRouter());
app.use(`/api/${version}`, createStationRouter());
app.use(`/api/${version}`, createParkingRouter());
app.use(`/api/${version}/trip`, tripRoutes);
app.use(`/api/${version}/payment`, paymentRoutes);

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
    console.log("connected!", socket.id);
});

app.get("/", (req, res) => {
    res.redirect(`/api/${version}/cities`);
});

// Telemetry route (WebSocket)
app.post("/telemetry", (req, res) => {
    const bikes = req.body.bikes || null;

    if (!bikes) {
        return res.status(400).json({ error: "No bikes" });
    }

    io.emit("bikes", bikes);
    // Skicka något svar så klienten inte hänger
    res.status(200).json({ ok: true });
});

// Startar server med Socket.IO
server.listen(port, async () => {
    console.log(`Server is listening on port: ${port}`);

    // Här startas simulatorn direkt när servern är igång.
    await startSimulator();
});

// Här stoppas simulatorn direkt när servern stängs ner.
const serverShutDown = async () => {
    // Anropar funktionen som sparar cyklarna i databasen.
    await stopSimulator();
};

// Stoppar simulatorn vid docker-compose down
process.on('SIGTERM', serverShutDown);
