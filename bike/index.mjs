"use strict";
import "dotenv/config";
import express from "express";
import { Worker } from "worker_threads";
import { randomUUID } from "crypto";


const app = express();
const port = process.env.BIKE_PORT || 7071;

const worker = new Worker(
  new URL('./Simulator.mjs', import.meta.url),
  { type: "module" }
);
const pending = new Map();

/**
 * Base function for making a call to the worker.
 * @param {command} cmd - Command
 * @param {*} payload - Data
 * @returns Promise
 */
function callWorker(cmd, payload = {}) {
  // used for each call to generate a unique call id
  const id = randomUUID();

  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });

    worker.postMessage({ id, cmd, payload });

    // optional timeout
    setTimeout(() => {
      if (pending.has(id)) {
        pending.get(id).reject(new Error("Worker timeout"));
        pending.delete(id);
      }
    }, 5000);
  });
}

worker.on('message', (msg) => {
  const { id, event, data} = msg;

  if (pending.has(id)) {
    pending.get(id).resolve({ event, data });
    pending.delete(id);
  }
})

app.get('/start', async (req, res) => {
  try {
    const response = await callWorker('start-job');
    console.log(response);
    res.json({
      ok: true,
      msg: 'started-job',
      bikes: response
    });
  } catch (error) {
    console.error(error)
  }
});

app.get('/end', async (req, res) => {
  try {
    const response = await callWorker('end-job');
    res.json({
      ok: true,
      msg: 'ending-job'
    });
  } catch (error) {
    console.error(error)
  }
});

app.get('/list', async (req, res) => {
  try {
    const response = await callWorker('list');
    res.json(response.data);
  } catch (error) {
    console.error(error)
  }
});

app.get('/move/:id/:x/:y', async (req, res) => {
  let x = req.params.x
  let y = req.params.y
  let id = req.params.id;

  let response = await callWorker('move', { x: x, y: y, id: id});

  res.json(response)
});

app.get('/bike/:id', async (req, res) => {
  let id = req.params.id;
  let response = await callWorker('get-bike', { id: id })

  res.json(response['data'])
});


app.listen(port, function () {
  console.log(`Listening on port: ${port}`);
});
