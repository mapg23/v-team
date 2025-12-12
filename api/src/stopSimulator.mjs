/**
 * Stops the simulator automatically when the API server stops.
 * Sends the current list of bikes from the simulator to the database.
 * This function runs only once when ther server stops.
 */


/**
 * Updates the current list of bikes in the database.
 * This function is intended to run once when the API server stops.
 */
import createBikes from "./models/bikes.mjs";

export default async function stopSimulator() {
    const bikes = createBikes();

    try {
        // Hämtar cyklarna från simulatorn vid stopp
        const response = await fetch("http://bike:7071/end", {
            method: "GET",
        });
        const bikesList = (await response.json()).data;

        for (const bike of bikesList) {
            await bikes.updateBike(bike.id, {
                status: bike.status,
                battery: bike.battery,
                location: bike.cords,
                occupied: bike.occupied
            });
        }

        console.log(`Simulator stopped with ${bikesList.length} bikes`);
    } catch (err) {
        console.error("Failed to start simulator:", err);
    }
}
