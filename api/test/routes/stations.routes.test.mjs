import request from 'supertest';
import express from 'express';
import createStationRouter from '../../src/routes/stationRoutes.mjs';
import createStations from '../../src/models/stations.mjs';
import createCities from '../../src/models/cities.mjs';

// Mocka databaser
const mockStationsDb = {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
};
const mockCitiesDb = {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
};

const stations = createStations(mockStationsDb);
const cities = createCities(mockCitiesDb);

const app = express();

app.use(express.json());
app.use(createStationRouter(stations, cities));

beforeAll(() => {
    console.error = jest.fn();
});


// Positiva tester (200/201)
describe("Stations API - OK", () => {
    test("POST /stations creates a station", async () => {
        mockCitiesDb.select.mockResolvedValue([{ id: 1, name: "City A" }]);
        mockStationsDb.insert.mockResolvedValue({ insertId: 10 });
        mockStationsDb.select.mockResolvedValue([
            {
                id: 10,
                city_id: 1,
                name: "Station X",
                latitude: 59.3,
                longitude: 18.1,
                capacity: 20
            }]);

        const res = await request(app)
            .post('/stations')
            .send({
                city_id: 1,
                name: "Station X",
                latitude: 59.3,
                longitude: 18.1,
                capacity: 20
            });

        expect(res.status).toBe(201);
        expect(res.body[0]).toHaveProperty("id", 10);
        expect(res.body[0]).toHaveProperty("name", "Station X");
    });

    test("GET /stations returns all stations", async () => {
        mockStationsDb.select.mockResolvedValue([
            {
                id: 1,
                city_id: 1,
                name: "Station A",
                latitude: 59.3,
                longitude: 18.0,
                capacity: 10
            }
        ]);

        const res = await request(app).get('/stations');

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty("id", 1);
    });

    test("GET /stations/:id returns a station", async () => {
        mockStationsDb.select.mockResolvedValue([
            {
                id: 2,
                city_id: 1,
                name: "Station B",
                latitude: 59.31,
                longitude: 18.01,
                capacity: 12
            }
        ]);

        const res = await request(app).get('/stations/2');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("id", 2);
        expect(res.body).toHaveProperty("name", "Station B");
    });

    test("PUT /stations/:id updates a station", async () => {
        mockStationsDb.update.mockResolvedValue({ affectedRows: 1 });
        mockStationsDb.select.mockResolvedValue([
            {
                id: 3,
                city_id: 1,
                name: "Station C",
                latitude: 59.32,
                longitude: 18.02,
                capacity: 25
            }
        ]);

        const res = await request(app)
            .put('/stations/3')
            .send({ capacity: 25 });

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty("capacity", 25);
    });

    test("DELETE /stations/:id deletes a station", async () => {
        mockStationsDb.remove.mockResolvedValue({ affectedRows: 1 });

        const res = await request(app).delete('/stations/3');

        expect(res.status).toBe(204);
    });
});


// Negativa tester (500)
describe("Stations API - NOK (500)", () => {
    test("POST /stations returns 500 on DB error", async () => {
        mockCitiesDb.select.mockResolvedValue([{ id: 1 }]);
        mockStationsDb.insert.mockRejectedValue(new Error("DB error"));

        const res = await request(app)
            .post('/stations')
            .send({ city_id: 1, name: "Station Y", latitude: 59.3, longitude: 18.1, capacity: 10 });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Could not create station");
    });

    test("GET /stations returns 500 on DB error", async () => {
        mockStationsDb.select.mockRejectedValue(new Error("DB error"));

        const res = await request(app).get('/stations');

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Could not fetch stations");
    });

    test("PUT /stations/:id returns 500 on DB error", async () => {
        mockStationsDb.update.mockRejectedValue(new Error("DB error"));

        const res = await request(app)
            .put('/stations/5')
            .send({ capacity: 15 });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Could not update station");
    });

    test("DELETE /stations/:id returns 500 on DB error", async () => {
        mockStationsDb.remove.mockRejectedValue(new Error("DB error"));

        const res = await request(app).delete('/stations/5');

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Could not delete station");
    });
});


// Negativa tester(400/404)
describe("Stations API - NOK (400/404)", () => {
    test("POST /stations returns 400 if required fields are missing", async () => {
        const res = await request(app)
            .post('/stations')
            // Saknar lat, lon, capacity
            .send({ city_id: 1, name: "Station Z" });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error", "Missing required fields");
    });

    test("POST /stations returns 404 if city not found", async () => {
        mockCitiesDb.select.mockResolvedValue([]);
        const res = await request(app)
            .post('/stations')
            .send(
                {
                    city_id: 999,
                    name: "Station Z",
                    latitude: 59.3,
                    longitude: 18.0,
                    capacity: 10
                });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "City not found");
    });

    test("GET /stations/:id returns 404 if station not found", async () => {
        mockStationsDb.select.mockResolvedValue([]);
        const res = await request(app).get('/stations/999');

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Station not found");
    });

    test("PUT /stations/:id returns 404 if station not found", async () => {
        mockStationsDb.update.mockResolvedValue({ affectedRows: 0 });
        const res = await request(app).put('/stations/999').send({ capacity: 10 });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Station not found");
    });

    test("DELETE /stations/:id returns 404 if station not found", async () => {
        mockStationsDb.remove.mockResolvedValue({ affectedRows: 0 });

        const res = await request(app).delete('/stations/999');

        expect(res.status).toBe(404);
    });

    test("GET /stations/:id returns 400 if id invalid", async () => {
        const res = await request(app).get('/stations/abc');

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    });

    test("PUT /stations/:id returns 400 if id invalid", async () => {
        const res = await request(app).put('/stations/abc').send({ capacity: 10 });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    });

    test("DELETE /stations/:id returns 400 if id invalid", async () => {
        const res = await request(app).delete('/stations/abc');

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    });
});
