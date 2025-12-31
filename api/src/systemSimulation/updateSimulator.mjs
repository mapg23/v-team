/**
 * Sends bike updates to the bike simulator.
 * Triggered whenever bike movement, zone data or bike data is
 * updated in the API.
 */

/**
  * Updates the bike simulator with new bike position and zone data.
  *
  * @param {Object} params - Update payload.
  * @param {number} params.bikeId - The ID of the bike being updated.
  * @param {number} params.latitude - The new latitude of the bike.
  * @param {number} params.longitude - The new longitude of the bike.
  * @param {string} [params.zoneType] - The zone type the bike belongs
  * to (e.g., "charging" or "parking").
  * @param {number} [params.zoneId] - The zone ID the bike belongs to.
  * @returns {Promise<void>} Resolves when the simulator has been notified.
  */
export default async function updateBikeZones(
    {
        bikeId,
        latitude,
        longitude,
        zoneType,
        zoneId
    }
) {
    try {
        await fetch(`http://bike:7071/move/${bikeId}/${longitude}/${latitude}`, {
            method: "GET"
        });

        console.log("Simulator updated for bike:", bikeId, zoneType, zoneId);
    } catch (err) {
        console.error("Failed to update simulator:", err);
    }
}


// /**
//  * Sends bike updates to the bike simulator.
//  * Triggered whenever bike movement, zone data or bike data is
//  * updated in the API.
//  */

// /**
//   * Updates the bike simulator with new bike position, zone data, and bike status.
//   *
//   * @param {Object} params - Update payload.
//   * @param {number} params.bikeId - The ID of the bike being updated.
//   * @param {number} params.latitude - The new latitude of the bike.
//   * @param {number} params.longitude - The new longitude of the bike.
//   * @param {string} [params.zoneType] - The zone type the bike belongs
//   * to (e.g., "charging" or "parking").
//   * @param {number} [params.zoneId] - The zone ID the bike belongs to.
//   * @param {number} [params.status] - Bike status
//   * @param {number} [params.battery] - Bike battery level
//   * @param {number} [params.occupied] - Bike occupancy
//   * @returns {Promise<void>} Resolves when the simulator has been notified.
//   */
// export default async function updateBikeZones({
//     bikeId,
//     latitude,
//     longitude,
//     zoneType,
//     zoneId,
//     status,
//     battery,
//     occupied
// }) {
//     try {

//         await fetch(`http://bike:7071/move/${bikeId}/${longitude}/${latitude}`, {
//             method: "GET"
//         });

//         // console.log(
//         //     "Updated for bike:",
//         //     bikeId,
//         //     "zoneType:", zoneType,
//         //     "zoneId:", zoneId,
//         //     "status:", status,
//         //     "battery:", battery,
//         //     "occupied:", occupied
//         // );
//     } catch (err) {
//         console.error("Failed to update simulator:", err);
//     }
// }
