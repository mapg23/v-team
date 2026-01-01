/**
 * Sends bike updates to the bike simulator.
 * Triggered whenever bike movement, zone data or bike data is
 * updated in the API.
 */

/**
 * Sends bike updates to the bike simulator.
 *
 * @param {Object} params - Update payload.
 * @param {number} params.bikeId - The ID of the bike being updated.
 * @param {number} params.latitude - The new latitude of the bike.
 * @param {number} params.longitude - The new longitude of the bike.
 * @param {string} [params.zoneType] - The zone type (e.g., "charging", "parking").
 * @param {number} [params.zoneId] - The zone ID.
 * @param {number} [params.status] - The bike status.
 * @param {number} [params.battery] - The battery level.
 * @param {number} [params.occupied] - The occupancy.
 * @returns {Promise<void>} Resolves when the simulator has been notified.
 */
export default async function updateSimulator(params) {
    const {
        bikeId,
        latitude,
        longitude,
        zoneType,
        zoneId,
        status,
        battery,
        occupied
    } = params;

    try {
        await fetch(`http://bike:7071/bike/${bikeId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                latitude,
                longitude,
                zoneType,
                zoneId,
                status,
                battery,
                occupied
            })
        });

        // console.log("Simulator updated for bike:", bikeId);
    } catch (err) {
        console.error("Failed to update simulator:", err);
    }
}
