import fs from "fs";
import { writeFile } from "fs/promises";
import { constrainedMemory } from "process";

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

const OSRM_URL = "http://localhost:6061"; // ÄNDRA

function rand(min, max) {
    return Math.random() * (max - min) + min;
}


function isFileEmpty(path) {
    return fs.statSync(path).size === 0;
}

const EPS = 1e-6
function same(a, b) {
    return Math.abs(a - b) < EPS;
}

function randomPoint(bounds) {
    return {
        lat: rand(bounds.min_lat, bounds.max_lat),
        lon: rand(bounds.min_long, bounds.max_long),
    };
}

async function snapToRoad({ lat, lon }) {
    const url = `${OSRM_URL}/nearest/v1/driving/${lon},${lat}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.waypoints || !data.waypoints.length) return null;

    const wp = data.waypoints[0];

    // Reject bad snaps (not actually on a road/sidewalk)
    if (wp.distance > 8) return null;

    return {
        y: Number(wp.location[1].toFixed(6)),
        x: Number(wp.location[0].toFixed(6)),
    };
}


async function generatePoints(city, count = 333) {
    const points = new Map(); // unique by lat+lon

    while (points.size < count) {
        // 70% city center, 30% full city
        const bounds =
            Math.random() < 0.7 ? city.cityCenter : city.full;

        const candidate = randomPoint(bounds);
        const snapped = await snapToRoad(candidate);

        if (!snapped) continue;

        const key = `${snapped.y},${snapped.x}`;
        points.set(key, snapped);
    }

    return Array.from(points.values());
}

async function generateJSON(scooters) {
    await writeFile('./data.json',
        JSON.stringify(scooters, null, 2,),
        "utf-8"
    )
}

async function instanciateBikes(count = 333) {
    const city = cityLimits.find(c => c.name === "Jönköping");
    const scooters = await generatePoints(city, count);

    let res = await fetch(`http://localhost:9091/mega-routing-machine`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(scooters)
    });
    let coordinates = await res.json();

    let createResp = await fetch(`http://localhost:9091/simulate-bikes-create`, {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(coordinates)
    });

    let bikes = await createResp.json();

    const result = {};

    for (let i = 0; i < coordinates.length; i++) {
        const start = coordinates[i][0];

        const bike = bikes.find(b =>
            same(b.latitude, start.y) &&
            same(b.longitude, start.x)
        );;

        if (bike) {
            result[bike.id] = coordinates[i];
        }
    }

    await fetch('http://localhost:9091/forward-routes', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(result)
    });

    return coordinates;
}

async function setBikesInMotion(params) {

}


(async () => {
    // SÄtt inte mer än 6000

    let cords = await instanciateBikes(6000); // Generera cyklar
})();

