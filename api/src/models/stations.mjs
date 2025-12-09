import dbDefault from "../database.mjs";

export default function createChargingZones(db = dbDefault) {
    const chargingZones = {
        /**
         * Get all charging zones.
         * @returns {Promise<Array>} List of charging zones.
         */
        getChargingZones: async function getChargingZones() {
            const zones = await db.select(
                'charging_zones',
                ['id', 'name', 'latitude', 'longitude']
            );
            return zones;
        },

        /**
         * Create a new charging zone.
         * @param {Object} body - Charging zone data.
         * @returns {Promise<Array>} Insert result.
         */
        createChargingZone: async function createChargingZone(body) {
            return await db.insert('charging_zones', body);
        },

        /**
         * Get a charging zone by ID.
         * @param {number} id - The ID of the charging zone.
         * @returns {Promise<Array>} Charging zone record.
         */
        getChargingZoneById: async function getChargingZoneById(id) {
            return await db.select(
                'charging_zones',
                ['id', 'name', 'latitude', 'longitude'],
                'id = ?',
                [id]
            );
        },

        /**
         * Update a charging zone in the database.
         * @param {number} id - The ID of the charging zone to update.
         * @param {Object} data - An object containing the fields to update.
         * @returns {Promise<Array>} The result of the database update operation.
         */
        updateChargingZone: async function updateChargingZone(id, data) {
            return await db.update('charging_zones', data, 'id = ?', [id]);
        },

        /**
         * Delete a charging zone from the database by ID.
         * @param {number} id - The ID of the charging zone to delete.
         * @returns {Promise<Array>} The result of the database delete operation.
         */
        deleteChargingZone: async function deleteChargingZone(id) {
            return await db.remove('charging_zones', 'id = ?', [id]);
        }
    };

    return chargingZones;
}
