"use strict";
import "dotenv/config";
import express from "express";

// Worker thread fetch
import { forwardToMain } from "./src/util.mjs";
// Worker thread
import { worker, pending } from "./src/Worker.mjs";

// Routes
import infoRoutes from "./routes/infoRoute.mjs";
import instanceRoutes from "./routes/instanceRoute.mjs";
import bikeRoute from "./routes/bikeRoute.mjs";

const app = express();
const port = process.env.BIKE_PORT || 7071;

// To support encoded bodies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb" }));

// Routes
app.use('/', infoRoutes);
app.use('/', instanceRoutes);
app.use('/', bikeRoute);

// Worker messages
// Priorities telemetry messages.
worker.on('message', (msg) => {
    if (msg.type === "telemetry") {
        forwardToMain(msg.data);
        return;
    }

    const { id, event, data } = msg;

    if (pending.has(id)) {
        pending.get(id).resolve({ event, data });
        pending.delete(id);
    }
});

app.listen(port, function () {
    console.log(`Listening on port: ${port}`);
});
