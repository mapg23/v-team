/**
 * Starts the simulator automatically when the API server starts.
 * Sends the current list of bikes to the simulator.
 * This function runs only once during server startup.
 */


/**
 * Starts the simulator by sending the current list of bikes from the API server.
 * This function is intended to run once when the API server starts.
 */
import createBikes from "./models/bikes.mjs";

export default async function startSimulator() {
    const bikes = createBikes();
    const bikesList = await bikes.getBikes();
    try {
        await fetch("http://bike:7071/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bikes: bikesList })
        });
    } catch (err) {
        console.error("Failed to start simulator:", err);
    }
}
