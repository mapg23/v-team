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

router.get('bike/getStatus/:id', async (req, res) => {
    let id = req.params.id || null;

    if (!id) {
        return res.status(404).json(
            {
                msg: "invalid id"
            }
        );
    }

    let response = await callWorker('get-bike-status', { id: id });

    res.json(response['data']);
});

router.post('bike/setStatus', async (req, res) => {
    let id = req.body.id || null;
    let status = req.body.status || null;

    if (!id || !status) {
        return res.status(404).json(
            {
                msg: "invalid PARAMS"
            }
        );
    }

    let response = await callWorker('set-bike-status', { id: id, status: status });

    res.json(response['data']);
});

/**
 * PUT URL:PORT/bike/move/:id/:x/:y 
 * GET /move/id/x/y - Moves a specific bike based on x and y.
 * X = Longitude.
 * Y = Latitued.
 */
router.get('move/:id/:x/:y', async (req, res) => {
    let x = req.params.x;
    let y = req.params.y;
    let id = req.params.id;

    let response = await callWorker('move-specific', { x: x, y: y, id: id });

    res.json(response);
});



export default router;
