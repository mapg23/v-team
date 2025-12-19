import request from 'supertest';
import express from 'express';
import createParkingRouter from '../../src/routes/parkingRoutes.mjs';
import createParkings from '../../src/models/parkings.mjs';

const mockDb = {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
};

const parkings = createParkings(mockDb);
const app = express();

app.use(express.json());
app.use(createParkingRouter(parkings));

beforeAll(() => {
    console.error = jest.fn();
});

describe("Parkings API - OK", () => {
    test("POST /parkings creates a parking zone", async () => {
        mockDb.insert.mockResolvedValue({ insertId: 10 });
        mockDb.select.mockResolvedValue([
            {
                id: 10,
                city_id: 1,
                max_lat: 59,
                max_long: 18,
                min_lat: 58,
                min_long: 17
            }
        ]);

        const res = await request(app)
            .post('/parkings')
            .send({
                cityId: 1,
                maxLat: 59,
                maxLong: 18,
                minLat: 58,
                minLong: 17
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id', 10);
        expect(res.body).toHaveProperty('cityId', 1);
        expect(res.body).toHaveProperty('maxLat', 59);
        expect(res.body).toHaveProperty('minLong', 17);
    });

    test("GET /parkings returns all parking zones", async () => {
        mockDb.select.mockResolvedValue([
            {
                id: 1,
                city_id: 2,
                max_lat: 59,
                max_long: 18,
                min_lat: 58,
                min_long: 17
            }
        ]);
        const res = await request(app).get('/parkings');

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id', 1);
        expect(res.body[0]).toHaveProperty('cityId', 2);
    });

    test("GET /parkings?cityId=2 returns zones for a city", async () => {
        mockDb.select.mockResolvedValue([
            {
                id: 2,
                city_id: 2,
                max_lat: 59,
                max_long: 18,
                min_lat: 58,
                min_long: 17
            }
        ]);
        const res = await request(app).get('/parkings').query({ cityId: 2 });

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('cityId', 2);
    });

    test("GET /parkings/:id returns a parking zone", async () => {
        mockDb.select.mockResolvedValue([
            {
                id: 3,
                city_id: 1,
                max_lat: 59,
                max_long: 18,
                min_lat: 58,
                min_long: 17
            }
        ]);
        const res = await request(app).get('/parkings/3');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', 3);
    });

    test("PUT /parkings/:id updates a parking zone", async () => {
        mockDb.update.mockResolvedValue({ affectedRows: 1 });
        mockDb.select.mockResolvedValue([
            {
                id: 3,
                city_id: 1,
                max_lat: 60,
                max_long: 18,
                min_lat: 58,
                min_long: 17
            }
        ]);

        const res = await request(app).put('/parkings/3').send({ maxLat: 60 });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('maxLat', 60);
    });

    test("DELETE /parkings/:id deletes a parking zone", async () => {
        mockDb.remove.mockResolvedValue({ affectedRows: 1 });
        const res = await request(app).delete('/parkings/3');

        expect(res.status).toBe(204);
    });
});

describe("Parkings API - NOK (400)", () => {
    test("POST /parkings returns 400 if fields missing", async () => {
        const res = await request(app).post('/parkings').send({ cityId: 1 });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Missing required fields');
    });

    test("GET /parkings/:id returns 400 if id invalid", async () => {
        const res = await request(app).get('/parkings/abc');

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    test("PUT /parkings/:id returns 400 if id invalid", async () => {
        const res = await request(app).put('/parkings/abc').send({ maxLat: 60 });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    test("DELETE /parkings/:id returns 400 if id invalid", async () => {
        const res = await request(app).delete('/parkings/abc');

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });
});

describe("Parkings API - NOK (404)", () => {
    test("GET /parkings/:id returns 404 if not found", async () => {
        mockDb.select.mockResolvedValue([]);
        const res = await request(app).get('/parkings/99');

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Parking zone not found');
    });

    test("PUT /parkings/:id returns 404 if not found", async () => {
        mockDb.update.mockResolvedValue({ affectedRows: 0 });
        const res = await request(app).put('/parkings/99').send({ maxLat: 60 });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Parking zone not found');
    });

    test("DELETE /parkings/:id returns 404 if not found", async () => {
        mockDb.remove.mockResolvedValue({ affectedRows: 0 });
        const res = await request(app).delete('/parkings/99');

        expect(res.status).toBe(404);
    });
});

describe("Parkings API - NOK (500)", () => {
    test("POST /parkings returns 500 on DB error", async () => {
        mockDb.insert.mockRejectedValue(new Error("DB error"));
        const res = await request(app).post('/parkings').send({
            cityId: 1,
            maxLat: 59,
            maxLong: 18,
            minLat: 58,
            minLong: 17
        });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error', 'Could not create parking zone');
    });

    test("GET /parkings returns 500 on DB error", async () => {
        mockDb.select.mockRejectedValue(new Error("DB error"));
        const res = await request(app).get('/parkings');

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error', 'Could not fetch parking zones');
    });

    test("PUT /parkings/:id returns 500 on DB error", async () => {
        mockDb.update.mockRejectedValue(new Error("DB error"));
        const res = await request(app).put('/parkings/3').send({ maxLat: 60 });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error', 'Could not update parking zone');
    });

    test("DELETE /parkings/:id returns 500 on DB error", async () => {
        mockDb.remove.mockRejectedValue(new Error("DB error"));
        const res = await request(app).delete('/parkings/3');

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error', 'Could not delete parking zone');
    });
});

describe("GET /parkings/:id/bikes", () => {
    test("should return all bikes for a parking zone", async () => {
        const parkingId = 1;

        // parking finns
        mockDb.select.mockResolvedValueOnce([{ id: parkingId }]);
        // bikes i parkeringen
        mockDb.select.mockResolvedValueOnce([
            { id: 1, status: 10 },
            { id: 2, status: 10 }
        ]);

        const res = await request(app).get(`/parkings/${parkingId}/bikes`);

        expect(res.status).toBe(200);
        expect(res.body.bikeCount).toBe(2);
        expect(res.body.bikes).toHaveLength(2);
        expect(res.body.bikes[0]).toHaveProperty("id", 1);
        expect(res.body.bikes[1]).toHaveProperty("id", 2);
    });

    test("should return 404 if parking zone not found", async () => {
        mockDb.select.mockResolvedValueOnce([]);

        const res = await request(app).get('/parkings/99/bikes');

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Parking zone not found");
    });

    test("should return 400 if parking id invalid", async () => {
        const res = await request(app).get('/parkings/abc/bikes');

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error", "Invalid parking id");
    });

    test("should return 500 on DB error", async () => {
        mockDb.select.mockRejectedValue(new Error("DB error"));

        const res = await request(app).get('/parkings/1/bikes');

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty(
            "error",
            "Could not fetch bikes for parking zone"
        );
    });
});
