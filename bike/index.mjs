"use strict";
import "dotenv";
import express from "express";
import { fork } from "child_process";


const app = express();
const port = process.env.BIKE_PORT || 7071;


// New Thread
const worker = fork("./Simulator.mjs");

worker.on('message', msg => {
  console.log("Worker message:", msg);
});

app.get('/start', (req, res) => {
  worker.send({ cmd: 'start-job'});
  res.json({
    ok: true,
    msg: 'started-job'
  });
});

app.get('/terminate', (req, res) => {
  worker.send({ cmd: 'terminate-job'});
  res.json({
    ok: true,
    msg: 'terminated-job'
  });
});

app.get('/move', (req, res) => {
  const x = Number(req.query.x);
  const y = Number(req.query.y);
  const id = Number(req.query.id);

  worker.send({
    cmd: 'move-bike',
    payload: {
      cords: { x, y },
      id: id
    }
  });

  res.json({ ok: true, x, y });
});


app.listen(port, function () {
  console.log(`Listening on port: ${port}`);
});
