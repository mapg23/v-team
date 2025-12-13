import request from 'supertest';
import express from 'express';
import createBikeRouter from '../../src/routes/bikeRoutes.mjs';
import createBikes from '../../src/models/bikes.mjs';

const mockDb = {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
};

const bikes = createBikes(mockDb);

const app = express();

app.use(express.json());
app.use(createBikeRouter(bikes));

beforeAll(() => {
    console.error = jest.fn();
});

describe("Bikes API - OK", () => {
    test("POST /bikes creates a bike", async () => {
        mockDb.insert.mockResolvedValue({ insertId: 10 });

        const res = await request(app)
            .post('/bikes')
            .send({
                status: "available",
                battery: 90,
                latitude: 59.33,
                longitude: 18.06,
                occupied: 0,
                city_id: 1
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id", 10);
    });

    test("GET /bikes returns bike list", async () => {
        mockDb.select.mockResolvedValue([
            {
                id: 1,
                status: "ok",
                battery: 80,
                latitude: 59.0,
                longitude: 18.0,
                occupied: 0,
                city_id: 1
            }
        ]);

        const res = await request(app).get('/bikes');

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty("id", 1);
    });

    test("GET /bikes/:id returns a bike", async () => {
        mockDb.select.mockResolvedValue([
            {
                id: 2,
                status: "ok",
                battery: 75,
                latitude: 59.0,
                longitude: 18.0,
                occupied: 0,
                city_id: 1
            }
        ]);

        const res = await request(app).get('/bikes/2');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("id", 2);
    });

    test("PUT /bikes/:id updates a bike", async () => {
        mockDb.update.mockResolvedValue({ affectedRows: 1 });

        const res = await request(app)
            .put('/bikes/3')
            .send({ battery: 50 });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Bike updated");
    });

    test("DELETE /bikes/:id deletes a bike", async () => {
        mockDb.remove.mockResolvedValue({ affectedRows: 1 });

        const res = await request(app).delete('/bikes/3');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Bike deleted");
    });
});

// Negativa tester (500)
describe("Bikes API - NOK (500)", () => {
    test("POST /bikes returns 500 on DB error", async () => {
        mockDb.insert.mockRejectedValue(new Error("DB error"));

        const res = await request(app)
            .post('/bikes')
            .send({
                status: "available",
                battery: 80,
                latitude: 59.0,
                longitude: 18.0,
                occupied: 0,
                city_id: 1
            });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Could not create bike");
    });

    test("GET /bikes returns 500 on DB error", async () => {
        mockDb.select.mockRejectedValue(new Error("DB error"));

        const res = await request(app).get('/bikes');

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Could not fetch bikes");
    });

    test("GET /bikes/:id returns 500 on DB error", async () => {
        mockDb.select.mockRejectedValue(new Error("DB error"));

        const res = await request(app).get('/bikes/5');

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Could not fetch bike");
    });

    test("PUT /bikes/:id returns 500 on DB error", async () => {
        mockDb.update.mockRejectedValue(new Error("DB error"));

        const res = await request(app)
            .put('/bikes/5')
            .send({ battery: 10 });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Could not update bike");
    });

    test("DELETE /bikes/:id returns 500 on DB error", async () => {
        mockDb.remove.mockRejectedValue(new Error("DB error"));

        const res = await request(app).delete('/bikes/5');

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error", "Could not delete bike");
    });
});

// Negativa tester (400/404)
describe("Bikes API - NOK (400), (404)", () => {
    test("POST /bikes returns 400 if required fields missing", async () => {
        const res = await request(app)
            .post('/bikes')
            .send({
                status: "available",
                battery: 90,
                occupied: 0
            });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error", "Missing required fields");
    });

    test("GET /bikes/:id returns 400 if id is invalid", async () => {
        const res = await request(app).get('/bikes/abc');

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error", "Invalid bike id");
    });

    test("GET /bikes/:id returns 404 if bike does not exist", async () => {
        mockDb.select.mockResolvedValue([]);

        const res = await request(app).get('/bikes/999');

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Bike not found");
    });

    test("PUT /bikes/:id returns 400 if id is invalid", async () => {
        const res = await request(app)
            .put('/bikes/abc')
            .send({ battery: 50 });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error", "Invalid bike id");
    });

    test("PUT /bikes/:id returns 404 if bike does not exist", async () => {
        mockDb.update.mockResolvedValue({ affectedRows: 0 });

        const res = await request(app)
            .put('/bikes/99')
            .send({ battery: 50 });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Bike not found");
    });

    test("DELETE /bikes/:id returns 400 if id is invalid", async () => {
        const res = await request(app).delete('/bikes/abc');

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error", "Invalid bike id");
    });

    test("DELETE /bikes/:id returns 404 if bike does not exist", async () => {
        mockDb.remove.mockResolvedValue({ affectedRows: 0 });

        const res = await request(app).delete('/bikes/99');

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error", "Bike not found");
    });
});
