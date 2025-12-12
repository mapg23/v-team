"use strict";
import express from "express";

import { callWorker } from "../src/Worker.mjs";

const router = express.Router();

router.get('/heartbeat', async (req, res) => {
    try {
        const response = await callWorker('heartbeat');

        res.json(response);
    } catch (error) {
        console.error(error);
    }
});

// cordinates params { bike_id : {...cordinates}, bike_id: {...cordinates}}
router.post('/setRoute', async (req, res) => {
    let cordinates = req.body.cordinates;
    // console.log(req.body);

    try {
        const response = await callWorker('setRoute', cordinates);
        // console.log(response);

        res.json(response);
    } catch (error) {
        console.error(error);
    }
});

router.get('/start', async (req, res) => {
    try {
        const response = await callWorker('start-job');

        console.log(response);
        res.json({
            ok: true,
            msg: 'started-job',
            bikes: response
        });
    } catch (error) {
        console.error(error);
    }
});

router.post('/start', async (req, res) => {
    try {
        let bikes = req.body.bikes;
        const response = await callWorker('start-job-memory', bikes);

        console.log(response);
        res.json({
            ok: true,
            msg: 'started-job-memory',
            res: response
        });
    } catch (error) {
        console.error(error);
    }
});

router.get('/end', async (req, res) => {
    try {
        const response = await callWorker('end-job');

        res.json(response);
    } catch (error) {
        console.error(error);
    }
});


export default router;
