"use strict";
import express, { json } from "express";
import "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.mjs";
import createUserRouter from "./src/routes/userRoutes.mjs";
import { Server } from "socket.io";
import http from "http";

const app = express();
const port = process.env.API_PORT || 9091;
const version = process.env.API_VERSION || "v1";

app.use(cors({ origin: "*" }));
app.set("json spaces", 2);
app.use(express.json());

// Döljer servertypen (Express) för ökad säkerhet
app.disable("x-powered-by");

// Monterar routern
app.use(`/api/${version}`, createUserRouter());
app.use(`/api/v1/auth`, authRoutes);

// -------- Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});


// När en klient ansluter
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // Exempel på event
  socket.emit("bike", {
    id: null,
    name: "socket",
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

// -------- ROUTES

app.get("/", (req, res) => {
  res.redirect(`/api/${version}/users`);
});

app.post("/telemetry", (req, res) => {
  console.log(req.body);
  res.json({ ok: true });
});

// Kör listen på server då vi kopplat på socketIO
// Kör vi bara app så får vi inte med socket.io servern
server.listen(port, function () {
  console.log(
    `Server is listening on port: ${port} with api version ${version}`
  );
});
