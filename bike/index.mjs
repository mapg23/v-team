"use strict";
import "dotenv/config";
import express from "express";

import { Worker } from "worker_threads";
import { randomUUID } from "crypto"; // used for each call

// worker.on("message", (msg) => { console.log("From worker:", msg); });
// worker.on("error", (err) => { console.error("Worker error:", err); });
// worker.on("exit", (code) => { console.log("Worker exited:", code); });

const app = express();
const port = process.env.BIKE_PORT || 7071;

const worker = new Worker(
  new URL('./Simulator.mjs', import.meta.url),
  { type: "module" }
);
const pending = new Map();

function callWorker(cmd, payload = {}) {
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
    res.json({
      ok: true,
      msg: 'listing devices',
      devices: response
    });
  } catch (error) {
    console.error(error)
  }
});


app.listen(port, function () {
  console.log(`Listening on port: ${port}`);
});
