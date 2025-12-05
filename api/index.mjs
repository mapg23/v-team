"use strict";
import express from 'express';
import cors from 'cors';
import 'dotenv';
import createUserRouter from './src/routes/userRoutes.mjs';

const app = express();
const port = process.env.API_PORT || 9091;
const version = process.env.API_VERSION;

app.use(express.json());

// Döljer servertypen (Express) för ökad säkerhet
app.disable('x-powered-by');
app.use(cors());

// Monterar routern
app.use(`/api/${version}`, createUserRouter());


app.post('/telemetry', (req, res) => {
    console.log(req.body);
    res.json({ ok: true });
});

app.listen(port, function() {
    console.log(`Server is listening on port: ${port}`);
});
