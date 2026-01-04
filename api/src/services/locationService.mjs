import createParkings from "../models/parkings.mjs";
import createStations from "../models/stations.mjs";

class LocationService {
    constructor(parkingsModel = createParkings(), stationsModel = createStations()) {
        this.parkingsModel = parkingsModel;
        this.stationsModel = stationsModel;
    }
    // Could use a singleton with cached this.parkings & ...chargings
    // if (this.parkingZones.length === 0) {
    //     this.parkingZones = this.model.getParkings();
    // When new parkings/chargers are added a refresh is made, to save db-calls?
    async fetchAllStations() {
        const stationsList = await this.stationsModel.getStations();

        if (stationsList.length <= 0) {
            throw new Error("No stations found");
        }
        return stationsList;
    }

    async fetchAllParkings() {
        const parkingsList = await this.parkingsModel.getParkings();

        if (parkingsList.length <= 0) {
            throw new Error("No stations found");
        }

        return parkingsList;
    }

    /**
     * Determine if a location/position is inside a given zone / on a position
     *
     * @param {Object} zone The coordinates for top left and bottom right corners of a zone
     * @param {Object} lat The latitude of the position to compare
     * @param {Object} long The longitude of the position to compare
     * @returns {boolean}
     */
    isInZone(zone, lat, long) {
        // console.log(lat, zone.max_lat, zone.min_lat, long, zone.max_long, zone.min_long);
        return (
            lat <= zone.max_lat &&
            lat >= zone.min_lat &&
            long <= zone.max_long &&
            long >= zone.min_long
        );
    }

    /**
     * Check whether a location is inside any of our parking zones
     *
     * @param {Number} lat
     * @param {Number} long
     * @returns {Promise<Number|null>}
     */
    async isInParking(lat, long) {
        const parkings = await this.fetchAllParkings();

        for (const parking of parkings) {
            if (this.isInZone(parking, lat, long)) {
                return parking.id;
            }
        }

        return null;
    }

    /**
     * Check whether a location is a charging spot.
     *
     * @param {Object} location {lat: <xx.xxxx>, long: <xx.xxxx>}
     * @returns {Promise<Number|null>}
     */
    async isInCharging(lat, long) {
        const stations = await this.fetchAllStations();

        for (const station of stations) {
            if (
                station.latitude === lat &&
                station.longitude === long
            ) {
                return station.id;
            }
        }
        return false;
    }

    /**
     * Determine if a location is in a zone - if so - what zone type and which zone.
     * returns databasefriendly values for the bike object.
     * @param {Number} lat
     * @param {Number} long
     * @returns {object} zone with {id: <id>, type: <type>}
     */
    async determineZone(lat, long) {
        const zone = {
            id: null,
            type: null,
        };
        const isParked = await this.isInParking(lat, long);
        const isCharging = await this.isInCharging(lat, long);

        if (isCharging) {
            zone.type = "charging";
            zone.id = isCharging;
        }

        if (isParked) {
            zone.type = "parking";
            zone.id = isParked;
        }

        return zone;
    }
}

const locationService = new LocationService;

export default locationService;
