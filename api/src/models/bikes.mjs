import dbDefault from "../database.mjs";

export default function createBikes(db = dbDefault) {
    const bikes = {
        /**
         * Get all bikes.
         * @returns {Promise<Array>} List of bikes.
         */
        getBikes: async function getBikes() {
            return await db.select(
                'scooters',
                [
                    'id',
                    'status',
                    'battery',
                    'latitude',
                    'longitude',
                    'occupied',
                    'city_id',
                    'current_zone_type',
                    'current_zone_id'
                ]
            );
        },

        /**
         * Create a new bike.
         * @param {Object} body - Bike data.
         * @returns {Promise<Array>} Insert result.
         */
        createBike: async function createBike(body) {
            return await db.insert('scooters', body);
        },

        /**
         * Get a bike by ID.
         *
         * @param {number} id - Bike ID.
         * @returns {Promise<Array>} Bike record.
         */
        getBikeById: async function getBikeById(id) {
            return await db.select(
                'scooters',
                [
                    'id',
                    'status',
                    'battery',
                    'latitude',
                    'longitude',
                    'occupied',
                    'city_id',
                    'current_zone_type',
                    'current_zone_id'
                ],
                'id = ?',
                [id]
            );
        },

        /**
         * Get all bikes in a specific city.
         *
         * @param {number} cityId - The city's ID.
         * @returns {Promise<Array>} List of bikes.
         */
        getBikesByCityId: async function getBikesByCityId(cityId) {
            return await db.select(
                'scooters',
                [
                    'id',
                    'status',
                    'battery',
                    'latitude',
                    'longitude',
                    'occupied',
                    'city_id',
                    'current_zone_type',
                    'current_zone_id'
                ],
                'city_id = ?',
                [cityId]
            );
        },

        /**
         * Update a bike.
         *
         * @param {number} id - Bike ID.
         * @param {Object} data - Fields to update.
         * @returns {Promise<Array>} Update result.
         */
        updateBike: async function updateBike(id, data) {
            return await db.update('scooters', data, 'id = ?', [id]);
        },

        /**
         * Delete a bike.
         *
         * @param {number} id - Bike ID.
         * @returns {Promise<Array>} Delete result.
         */
        deleteBike: async function deleteBike(id) {
            return await db.remove('scooters', 'id = ?', [id]);
        },

    };

    return bikes;
}

/**
 * Validates if a given zone ID exists for the specified type and city.
 *
 * @param {string|null} currentZoneType - Type of the zone ('charging' or 'parking').
 * Null means free parking.
 * @param {number|null} currentZoneId - ID of the zone to validate.
 * @param {number} cityId - ID of the city to check the zone against.
 * @param {object} [db=dbDefault] - Database instance to query zones.
 * @returns {Promise<boolean>} True if the zone exists and matches
 * the city/type, false otherwise.
 */
export async function validateZone(
    currentZoneType,
    currentZoneId,
    cityId,
    db = dbDefault) {
    if (!currentZoneType) {
        // Fri parkering
        return true;
    }

    switch (currentZoneType) {
        case 'charging': {
            const charging = await db.select(
                'charging_zones',
                ['id'],
                // Kontrollerar att zonen både finns och tillhör rätt stad.
                'id = ? AND city_id = ?',
                [currentZoneId, cityId]
            );

            return charging.length > 0;
        }

        case 'parking': {
            const parking = await db.select(
                'parking_zones',
                ['id'],
                'id = ? AND city_id = ?',
                [currentZoneId, cityId]
            );

            return parking.length > 0;
        }

        default:
            // Ogiltig typ
            return false;
    }
}

/**
 * Get the coordinates for a given zone.
 *
 * For 'charging' zones, returns the zone's latitude and longitude.
 * For 'parking' zones, returns the center point of the rectangular area.
 *
 * @param {string} zoneType - Type of the zone ('charging' or 'parking').
 * @param {number} zoneId - ID of the zone to fetch coordinates for.
 * @returns {Promise<object|null>} Coordinates object or null.
 */
export async function getZoneCoordinates(zoneType, zoneId, db = dbDefault) {
    switch (zoneType) {
        case 'charging': {
            const zone = await db.select(
                'charging_zones',
                ['latitude', 'longitude'],
                'id = ?',
                [zoneId]
            );

            if (!zone[0]) {
                return null;
            }
            return {
                latitude: Number(zone[0].latitude),
                longitude: Number(zone[0].longitude)
            };
        }
        case 'parking': {
            const zone = await db.select(
                'parking_zones',
                ['min_lat', 'max_lat', 'min_long', 'max_long'],
                'id = ?',
                [zoneId]
            );

            if (!zone[0]) {
                return null;
            }
            // Sätter lat/lon till mitten av fyrkanten
            const lat = (parseFloat(zone[0].min_lat) + parseFloat(zone[0].max_lat)) / 2;

            const lon = (parseFloat(zone[0].min_long) + parseFloat(zone[0].max_long)) / 2;

            return {
                latitude: lat,
                longitude: lon
            };
        }
        default:
            return null;
    }
}
