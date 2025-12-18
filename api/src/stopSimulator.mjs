/**
 * Stops the simulator automatically when the API server stops.
 * Updates the current list of bikes from the simulator into the database.
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
            // Mappning från simulatorns fält till databasen
            const updateData = {
                status: bike.status,
                battery: bike.battery,
                latitude: bike.cords.y,
                longitude: bike.cords.x,
                occupied: bike.occupied,
                city_id: bike.city_id,
                current_zone_type: bike.current_zone_type ?? null,
                current_zone_id: bike.current_zone_id ?? null
            };

            await bikes.updateBike(bike.id, updateData);
        }

        console.log(`Simulator stopped and ${bikesList.length} bikes saved to database`);
    } catch (err) {
        console.error("Failed to stop simulator and save bikes:", err);
    }
}
