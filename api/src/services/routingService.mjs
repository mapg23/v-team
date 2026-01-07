
import "fs";
import LocationService from "./locationService.mjs";

/**
 * Latituderna är lata för dom ligger ner.
 * Longituderna är långa för dom står.
 *
 * latitud   incre. S -> N 55, 58 etc
 *
 * longitud  incre. E -> W 13, 14 etc
 *
 * { x:, y: } -> switch { lat:, long: }
 *
 * Bankeryd
 * Full:
 * 57.832568, 14.103870
 * 57.864247, 14.149260
 *
 * City:
 * 57.854725, 14.111394
 * 57.864010, 14.141786
 *
 * HABO
 * Full
 * 57.932100, 14.122130
 * 57.886250, 14.049000
 *
 * Habo city.
 * 57.891930, 14.0702600
 * 57.914183, 14.100562
 *
 *
 * Jönköping
 * full:
 * 57.784041, 14.215524
 * 57.748640, 14.123614
 *
 * Jnkpg City:
 * 57.781616, 14.199281
 * 57.764415, 14.136360
 */

// Hårdkodade punkter.
const cityLimits = [
    {
        name: "Habo",
        full: {
            max_lat: 57.932100,
            max_long: 14.122130,
            min_lat: 57.886250,
            min_long: 14.049000
        },
        cityCenter: {
            max_lat: 57.914183,
            max_long: 14.100562,
            min_lat: 57.891930,
            min_long: 14.0702600,
        },
    },
    {
        name: "Bankeryd",
        full: {
            max_lat: 57.864247,
            max_long: 14.149260,
            min_lat: 57.832568,
            min_long: 14.103870,
        },
        cityCenter: {
            max_lat: 57.864010,
            max_long: 14.141786,
            min_lat: 57.854725,
            min_long: 14.111394,
        },
    },
    {
        name: "Jönköping",
        full: {
            max_lat: 57.784041,
            max_long: 14.215524,
            min_lat: 57.748640,
            min_long: 14.123614,
        },
        cityCenter: {
            max_lat: 57.781616,
            max_long: 14.199281,
            min_lat: 57.764415,
            min_long: 14.136360,
        }

    }
];

/**
 * This service can provide a surprise route in your city.
 * Pass a coords object:
 *
 *     "coords": {
 *        "x": "14.125001", "y": "57.860000"
 *  }
 *
 * And It will create a route along roads to a random spot in the same city.
 */
class RoutingService {
    constructor(
        locationService = LocationService
    ) {
        this.url = "http://osrm:5000/route/v1/bike/";
        this.cityLimits = cityLimits;
        this.locationService = locationService;
    }
    /**
     * Turns a coordinate to a random route.
     * @param {object} coords As described above.
     * @returns A route in json format.
     */
    async generateRoute(coords) {
        // Add more destinations
        const dest1 = await this.getRandomDestination(coords);

        const fetchUrl = `${this.url}` +
            `${coords.x},${coords.y};` +
            `${dest1.long},${dest1.lat}` +
            `?overview=full&geometries=geojson`;

        console.log("Fetching: ", fetchUrl);

        const res = await fetch(fetchUrl, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        const route = await res.json();

        console.log("res: ", route);

        return route;
    };

    /**
     * Takes an array of coordinate objects and returns routes.
     * @param {Array} coordsArray [ {"x": "14.12487", "y": "57.860041"}, {...} ... ]
     * @returns {Array} An array of smaller objects with just the coordinates,
     * to keep the size down.
     */
    async generateManyRoutes(coordsArray) {
        let routesArray = [];

        for (const coords of coordsArray) {
            const route = await this.generateRoute(coords);

            routesArray.push(route?.routes[0]?.geometry || []);
        }
        return routesArray;
    }

    /**
     * Checks which city the coord is in.
     * Gets a random destination inside the city center of that city.
     * @param {object} coords As described above
     * @returns {object} The coordinates for the destination.
     */
    async getRandomDestination(coords) {
        const lat = coords.y;
        const long = coords.x;

        for (const city of this.cityLimits) {
            if (this.locationService.isInZone(city.full, lat, long)) {
                const destination = this.calculateRandomCoordsInZone(city.cityCenter);

                console.log(destination, city.name);

                return destination;
            }
        }
    }

    /**
     * Creates a new point inside a zone.
     * @param {object} zone A zone-object:
     *      {max_lat: <coord.>, min_lat: <coord.>, max_long: <coord.>, min_long: <coord>}.
     *
     * @returns {object} {lat: <xx.xxxxxx>, long: <xx.xxxxxx>}
     */
    calculateRandomCoordsInZone(zone) {
        const lat = Math.random() * (zone.max_lat - zone.min_lat) + zone.min_lat;
        const long = Math.random() * (zone.max_long - zone.min_long) + zone.min_long;

        return {lat, long};
    }
};

export { RoutingService };
const routingService = new RoutingService;

export default routingService;
