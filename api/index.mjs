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
import startSimulator from "./src/systemSimulation/startSimulator.mjs";
import stopSimulator from "./src/systemSimulation/stopSimulator.mjs";
import tripRoutes from "./src/routes/tripRoutes.mjs";
import paymentRoutes from "./src/routes/paymentRoutes.mjs";
import priceRoutes from "./src/routes/priceRoutes.mjs";
import walletRoutes from "./src/routes/walletRoutes.mjs";
import routingService from "./src/services/routingService.mjs";

import createBikes from "./src/models/bikes.mjs";
import { json } from "stream/consumers";

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

/**
 * Req body object:
 * { x: <coordinate>, y: <coordinate> }
 */
app.post("/routing-machine", async (req, res) => {
    try {
        const coords = req.body;

        if (!coords) {
            throw new Error('Missing "coords" in request body {x:<>, y:<>}');
        }

        const result = await routingService.generateRoute(coords);

        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.json(err);
    }
});

/**
 * Req body: Array av object
 * [
 *  { x: <coordinate>, y: <coordinate> },
 * {...},
 * ...
 * ]
 */
app.post("/mega-routing-machine", async (req, res) => {
    try {
        const coordsArray = req.body;

        if (!coordsArray) {
            throw new Error('Missing "coordsArray" in request body [{x:<>, y:<>}]');
        }

        const result = await routingService.generateManyRoutes(coordsArray);

        return res.json(result);
    } catch (err) {
        console.error(err);
        return res.json(err);
    }
});


app.post("/simulate-bikes-create", async (req, res) => {
    try {
        const coordinates = req.body;


        if (!coordinates) {
            throw new Error("Missing coordinates");
        }
        let bikeModel = createBikes();

        await bikeModel.deleteAllBikes();
        let bikes = [];

        for (let i = 0; i < coordinates.length; i++) {
            let first = { "latitude": coordinates[i][0].y, "longitude": coordinates[i][0].x };

            bikes[i] = {
                'status': 100,
                'battery': 100,
                'latitude': first.latitude,
                'longitude': first.longitude,
                'occupied': 1,
                'city_id': 1
            };
        }

        let creation = await bikeModel.createBikeSimulator(bikes);

        console.log(creation);

        const firstId = Number(creation.insertId);
        const count = Number(creation.affectedRows);

        const bikesWithIds = bikes.map((bike, i) => ({
            id: firstId + i,
            ...bike
        }));

        return res.json(bikesWithIds);
    } catch (err) {
        console.error(err);
        return res.json(err);
    }
});

app.post('/forward-routes', async (req, res) => {
    try {
        let coordinates = req.body;

        if (!coordinates) {
            throw new Error("NO COORDINATES");
        }

        await startSimulator();

        console.log(coordinates);

        let setRes = await fetch(`http://bike:7071/setRoute`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(coordinates)
        });

        // console.log(await setRes.json());
    } catch (err) {
        console.error(err);
    }
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
app.use(`/api/${version}/prices`, priceRoutes);
app.use(`/api/${version}/wallets`, walletRoutes);

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
