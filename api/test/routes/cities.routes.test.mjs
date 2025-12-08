import request from 'supertest';
import express from 'express';
import createCityRouter from '../../src/routes/cityRoutes.mjs';
import createCities from '../../src/models/cities.mjs';

const mockDb = {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
};

const cities = createCities(mockDb);

const app = express();

app.use(express.json());
app.use(createCityRouter(cities));

beforeEach(() => {
    jest.clearAllMocks();
    // Stänger ner console.error för tester
    console.error = jest.fn();
});

describe('Cities API - ok', () => {
    test('POST /cities creates a city', async () => {
        // Inga dubbletter
        mockDb.select.mockResolvedValueOnce([]);
        mockDb.insert.mockResolvedValue({ insertId: 1 });
        mockDb.select.mockResolvedValue([
            { id: 1, name: 'Jönköping', latitude: 57.7815, longitude: 14.1562 }
        ]);

        const res = await request(app)
            .post('/cities')
            .send({ name: 'Jönköping' });

        expect(res.status).toBe(201);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0].name).toBe('Jönköping');
        expect(res.body[0].latitude).toBe(57.7815);
        expect(res.body[0].longitude).toBe(14.1562);
    });

    test('GET /cities/:id returns a city', async () => {
        mockDb.select.mockResolvedValue([
            { id: 1, name: 'Jönköping', latitude: 57.7815, longitude: 14.1562 }
        ]);
        const res = await request(app).get('/cities/1');

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id', 1);
    });

    test('GET /cities/ returns cities', async () => {
        mockDb.select.mockResolvedValue([
            { id: 1, name: 'Jönköping', latitude: 57.7815, longitude: 14.1562 }
        ]);
        const res = await request(app).get('/cities');

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id', 1);
        expect(res.body[0].name).toBe('Jönköping');
    });

    test('PUT /cities/:id update a city', async () => {
        mockDb.select.mockResolvedValue([
            { id: 1, name: 'Jönköping City', latitude: 57.7815, longitude: 14.1562 }
        ]);
        const res = await request(app)
            .put('/cities/1')
            .send({ id: 1, name: 'Jönköping City', latitude: 57.7815, longitude: 14.1562 });

        expect(res.status).toBe(200);
        expect(res.body[0].name).toBe('Jönköping City');
    });

    test('DELETE /cities/:id delete a city', async () => {
        const res = await request(app).delete('/cities/1');

        expect(res.status).toBe(204);
    });

    test('GET /cities?name returns city by name', async () => {
        mockDb.select.mockResolvedValue([
            { id: 1, name: 'Jönköping', latitude: 57.7815, longitude: 14.1562 }
        ]);
        const res = await request(app).get('/cities?name=Jönköping');

        expect(res.status).toBe(200);
        expect(res.body[0].name).toBe('Jönköping');
    });
});

describe('Cities API - NOK (500)', () => {
    test('POST /cities returns 500 on DB error', async () => {
        mockDb.select.mockResolvedValue([]);
        mockDb.insert.mockRejectedValue(new Error('DB error'));
        const res = await request(app).post('/cities').send({ name: 'Habo' });

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Could not create city');
    });

    test('GET /cities/:id returns 500 on DB error', async () => {
        mockDb.select.mockRejectedValue(new Error('DB error'));
        const res = await request(app).get('/cities/1');

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Could not fetch city');
    });

    test('GET /cities returns 500 on DB error', async () => {
        mockDb.select.mockRejectedValue(new Error('DB error'));
        const res = await request(app).get('/cities');

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Could not fetch cities');
    });
});

describe('Cities API - NOK (400)', () => {
    test('POST /cities returns 400 if name is empty', async () => {
        const res = await request(app).post('/cities').send({ name: '' });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Name is missing');
    });

    test('PUT /cities/:id returns 400 if id is invalid', async () => {
        const res = await request(app).put('/cities/abc').send({ name: 'Habo' });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Id is wrong');
    });

    test('DELETE /cities/:id returns 400 if id is invalid', async () => {
        const res = await request(app).delete('/cities/abc');

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Id is wrong');
    });
});
