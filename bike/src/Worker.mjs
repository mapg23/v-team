"use strict";
import { Worker } from "worker_threads";
import { randomUUID } from "crypto";

// Worker setup
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

export { worker, pending, callWorker };
