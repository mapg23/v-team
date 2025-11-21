"use strict";
import express from 'express';
import cors from 'cors';
import 'dotenv';
import validateJsonBody from './src/middleware/validateJsonBody.mjs';
import userRoutes from './src/routes/userRoutes.mjs';

const app = express();
const port = process.env.API_PORT || 9091;
const version = process.env.API_VERSION;

app.use(express.json());

// Döljer servertypen (Express) för ökad säkerhet
app.disable('x-powered-by');
app.use(cors());

// Middleware som kontrollerar body
app.use(validateJsonBody);

// Montera routern
app.use(`/api/${version}`, userRoutes);


app.listen(port, function() {
    console.log(`Server is listening on port: ${port}`);
});
