"use strict";
/**
 * Function to post bikes to api, uses worker thread messages to continously call this function.
 * @param {Array} data - Array of bikes
 */
async function forwardToMain(data) {
    try {
        await fetch('http://api:9091/telemetry', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bikes: data }),
        });
    } catch (err) {
        console.error("Failed to start telemetry", err.message);
    }
}

export { forwardToMain };
