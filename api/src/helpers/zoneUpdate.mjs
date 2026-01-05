/**
 * A helper function to handle bike zone updates.
 * Validates zoneType and zoneId, fetches coordinates if a zone is provided,
 * and keeps lat/lng unchanged if zone is null (free parking).
 */

import { validateZone, getZoneCoordinates } from "../models/bikes.mjs";

/**
 * Updates coordinates based on the provided zone.
 *
 * @param {Object} bike - Bike object from the database
 * @param {string|null} currentZoneType - Zone type ("parking", "charging") or null
 * @param {number|null} currentZoneId - Zone ID or null
 * @param {number} latitude - Current latitude
 * @param {number} longitude - Current longitude
 * @param {Object} bikesDb - Database reference
 * @returns {Promise<{latitude:number, longitude:number}>} - Updated coordinates
 */
export default async function handleZoneUpdate(
    bike, currentZoneType, currentZoneId, latitude, longitude, bikesDb
) {
    const allowed = ["parking", "charging"];

    if (currentZoneType != null && !allowed.includes(currentZoneType)) {
        throw { status: 400, message: "Invalid zone type" };
    }

    if (currentZoneId != null && isNaN(currentZoneId)) {
        throw { status: 400, message: "Invalid zone ID" };
    }

    if (currentZoneType && currentZoneId) {
        const isValid = await validateZone(currentZoneType, currentZoneId, bike.city_id, bikesDb);

        if (!isValid) {
            throw { status: 400, message: "Invalid zone" };
        }

        const coords = await getZoneCoordinates(currentZoneType, currentZoneId);

        if (!coords) {
            throw { status: 400, message: "Zone coordinates not found" };
        }

        return {
            latitude: coords.latitude,
            longitude: coords.longitude
        };
    }

    // Null för friparkering, behåller lat/long
    return { latitude, longitude };
}
