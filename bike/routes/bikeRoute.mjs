"use strict";
import express from "express";

import { callWorker } from "../src/Worker.mjs";

const router = express.Router();

/**
 * GET /bike/id - Returns specific bike with id.
 */
router.get('bike/:id', async (req, res) => {
    let id = req.params.id;
    let response = await callWorker('get-bike', { id: id });

    res.json(response['data']);
});

/**
 * GET /move/id/x/y - Moves a specific bike based on x and y.
 * X = Longitude.
 * Y = Latitued.
 */
router.get('/move/:id/:x/:y', async (req, res) => {
    let x = req.params.x;
    let y = req.params.y;
    let id = req.params.id;

    let response = await callWorker('move-specific', { x: x, y: y, id: id });

    res.json(response);
});



export default router;
