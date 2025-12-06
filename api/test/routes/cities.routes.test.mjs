
import request from 'supertest';
import express from 'express';
import createCityRouter from '../../src/routes/cityRoutes.mjs';
import createCities from '../../src/models/cities.mjs';

// Mockar databasen
const mockDb = {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
};

// Skapar users-objektet med mocken
const cities = createCities(mockDb);

// Skapar app och montera routern
const app = express();

app.use(express.json());
app.use(createCityRouter(cities));

// Testerna
describe('Cities API - ok', () => {
    // Byter ut console.error mot en tom funktion, Inget skrivs till terminalen.
    beforeAll(() => {
        console.error = jest.fn();
    });
    test('POST /cities creates a city', async () => {
        mockDb.insert.mockResolvedValue({ insertId: 1 });
        mockDb.select.mockResolvedValue([
            {
                id: 1,
                name: 'Jönköping',
                latitude: 57.781500,
                longitude: 14.156200
            }
        ]);

        const res = await request(app)
            .post('/cities')
            .send(
                {
                    name: 'Jönköping'
                }
            );

        expect(res.status).toBe(201);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0].name).toBe('Jönköping');
        expect(res.body[0].latitude).toBe(57.781500);
        expect(res.body[0].longitude).toBe(14.156200);
    });

    test('GET /cities/:id returns a city', async () => {
        mockDb.select.mockResolvedValue([
            {
                id: 1,
                name: 'Jönköping',
                latitude: 57.781500,
                longitude: 14.156200
            }
        ]);
        const res = await request(app).get('/cities/1');

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id', 1);
    });

    test('GET /cities/ returns cities', async () => {
        mockDb.select.mockResolvedValue([
            {
                id: 1,
                name: 'Jönköping',
                latitude: 57.781500,
                longitude: 14.156200
            }
        ]);
        const res = await request(app).get('/cities');

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id', 1);
        expect(res.body[0]).toHaveProperty('name', 'Jönköping');
        expect(res.body[0]).toHaveProperty('latitude', 57.781500);
        expect(res.body[0]).toHaveProperty('longitude', 14.156200);
    });

    test('PUT /cities/:id update a city', async () => {
        mockDb.select.mockResolvedValue([
            { id: 1,
                name: "Jönköping City",
                latitude: 57.781500,
                longitude: 14.156200
            }
        ]);
        const res = await request(app)
            .put('/cities/1')
            .send(
                { id: 1,
                    name: "Jönköping City",
                    latitude: 57.781500,
                    longitude: 14.156200
                });

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0].name).toBe('Jönköping City');
        expect(res.body[0].latitude).toBe(57.781500);
        expect(res.body[0].longitude).toBe(14.156200);
    });


    test('DELETE /cities/:id delete a city', async () => {
        const res = await request(app)
            .delete('/cities/1');

        expect(res.status).toBe(204);
    });

    test('GET /cities?name returns city by name', async () => {
        mockDb.select.mockResolvedValue([
            { id: 1, name: "Jönköping", latitude: 57.781500, longitude: 14.156200 }
        ]);

        const res = await request(app).get('/cities?name=Jönköping');

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id', 1);
        expect(res.body[0]).toHaveProperty('latitude', 57.781500);
        expect(res.body[0]).toHaveProperty('longitude', 14.156200);
    });
});

// De negativa fallen
describe('Cities API - NOK (500)', () => {
    // Byter ut console.error mot en tom funktion, Inget skrivs till terminalen.
    beforeAll(() => {
        console.error = jest.fn();
    });
    test('POST /cities returns 500 on error', async () => {
        mockDb.insert.mockRejectedValue(new Error('DB error'));
        const res = await request(app)
            .post('/cities')
            .send({ name: 'Habo'
            });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error', 'Could not create city');
    });

    test('GET /cities/:id returns 500 on error', async () => {
        mockDb.select.mockRejectedValue(new Error('DB error'));
        const res = await request(app).get('/cities/1');

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error', 'Could not fetch city');
    });

    test('GET /cities returns 500 on error', async () => {
        mockDb.select.mockRejectedValue(new Error('DB error'));
        const res = await request(app).get('/cities');

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error', 'Could not fetch cities');
    });

    test('PUT /cities/:id returns 500 on error', async () => {
        mockDb.select.mockRejectedValue(new Error('DB error'));
        const res = await request(app)
            .put('/cities/1')
            .send({
                name: 'Habo City',
                latitude: 57.9093,
                longitude: 14.0744
            });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error', 'Could not update city');
    });

    test('DELETE /cities/:id returns 500 on error', async () => {
        mockDb.remove.mockRejectedValue(new Error('DB error'));
        const res = await request(app).delete('/cities/1');

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error', 'Could not delete city');
    });

    test('GET /cities?name= triggers 500 on db error', async () => {
        mockDb.select.mockRejectedValue(new Error('DB error'));

        const res = await request(app).get('/cities?name=Habos');

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

// Negativa tester för 400
describe('cities API - NOK (400), (404)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Saknade namnfält vid skapande.
    test('POST /cities/ returns 400 if name is empty', async () => {
        const res = await request(app)
            .post('/cities')
            .send({
                name: ''
            });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Name is missing');
    });

    test('POST /cities returns 404 if city not found via Nominatim', async () => {
        // simulerar att inget hittas
        mockDb.select.mockResolvedValue([]);
        const res = await request(app)
            .post('/cities')
            .send({ name: 'NonExistingCity' });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'City not found');
    });

    // Saknade namnfält för stad vid uppdatering
    test('PUT /cities/:id returns 400 if name is empty', async () => {
        const res = await request(app)
            .put('/cities/1')
            .send({
                name: '',
                latitude: 57.9093,
                longitude: 14.0744
            });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Name is missing');
    });



    // Ogiltigt eller saknat id
    test('GET /cities/:id returns 400 if id is invalid', async () => {
    // id som inte är nummer.
        const res = await request(app).get('/cities/abc');

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Id is wrong');
    });


    test('PUT /cities/:id returns 400 if id is invalid', async () => {
        const res = await request(app)
            .put('/cities/abc')
            .send({
                name: 'Habo',
                latitude: 57.9093,
                logitude: 14.0744
            });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Id is wrong');
    });

    test('DELETE /cities/:id returns 400 if id is invalid', async () => {
        const res = await request(app).delete('/cities/abc');

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Id is wrong');
    });
});
