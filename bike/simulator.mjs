import { parentPort } from "worker_threads";

console.log("WORKER STARTED!");

parentPort.on("message", (msg) => {
  console.log("Worker received:", msg);
  parentPort.postMessage({ got: msg });
});
