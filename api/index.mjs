"use strict";
import express from "express";
import "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import authMiddleware from "./src/middleware/authMiddleware.mjs";

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

const app = express();
const port = process.env.API_PORT || 9091;
const version = process.env.API_VERSION || "v1";

// Middleware

// Viktigt för att IOS ska fungera
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.set("json spaces", 2);
app.use(express.json({ limit: "10mb" }));
// Döljer Express-version
app.disable("x-powered-by");

// -------- Socket.io ( MÅST LIGGA HÄR UPPE)
const server = createServer(app);
const io = new Server(server, {
    maxHttpBufferSize: 10 * 1024 * 1024,
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },

    // Viktigt för att IOS ska fungera
    transports: ["polling"],
    allowUpgrades: false,
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



// ------------------------------
// ----------- Routes -----------
// ------------------------------
app.use(`/api/${version}/auth`, authRoutes);

// - Applies authMiddleware to all routes after this point -
if (process.env.NODE_ENV === "test") {
    // Mini middleware, sets all users to admin for tests
    app.use((req, _res, next) => {
        req.user = { id: 1, role: "user" };
        next();
    });
} else {
    app.use(authMiddleware);
}

app.use(`/api/${version}`, createUserRouter());
app.use(`/api/${version}`, createCityRouter());
app.use(`/api/${version}`, createBikeRouter());
app.use(`/api/${version}`, createStationRouter());
app.use(`/api/${version}`, createParkingRouter());

app.use(`/api/${version}/trips`, tripRoutes);
app.use(`/api/${version}/payments`, paymentRoutes);

// Startar server med Socket.IO
server.listen(port, "0.0.0.0", async () => {
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
