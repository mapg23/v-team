"use strict";
import express from "express";

import { callWorker } from "../src/Worker.mjs";

const router = express.Router();

/**
 * GET /list
 * Returns a list of all bikes.
 */
router.get('/list', async (req, res) => {
    try {
        const response = await callWorker('list');

        res.json(response.data);
    } catch (error) {
        console.error(error);
    }
});


export default router;
