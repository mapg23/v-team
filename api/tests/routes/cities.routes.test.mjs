
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
                    name: 'Jönköping',
                    latitude: 57.781500,
                    longitude: 14.156200
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

    test('PUT /users/:id update a city', async () => {
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

// // De negativa fallen
// describe('Users API - NOK (500)', () => {
//     // Byter ut console.error mot en tom funktion, Inget skrivs till terminalen.
//     beforeAll(() => {
//         console.error = jest.fn();
//     });
//     test('POST /users returns 500 on error', async () => {
//         mockDb.insert.mockRejectedValue(new Error('DB error'));
//         const res = await request(app)
//             .post('/users')
//             .send({ username: 'Falcon', email: 'falcon@hotmail.com' });

//         expect(res.status).toBe(500);
//         expect(res.body).toHaveProperty('error', 'Could not create user');
//     });

//     test('GET /users/:id returns 500 on error', async () => {
//         mockDb.select.mockRejectedValue(new Error('DB error'));
//         const res = await request(app).get('/users/1');

//         expect(res.status).toBe(500);
//         expect(res.body).toHaveProperty('error', 'Could not fetch user');
//     });

//     test('GET /users returns 500 on error', async () => {
//         mockDb.select.mockRejectedValue(new Error('DB error'));
//         const res = await request(app).get('/users');

//         expect(res.status).toBe(500);
//         expect(res.body).toHaveProperty('error', 'Could not fetch users');
//     });

//     test('PUT /users/:id returns 500 on error', async () => {
//         mockDb.select.mockRejectedValue(new Error('DB error'));
//         const res = await request(app)
//             .put('/users/1')
//             .send({ username: 'Falcon Bird', email: 'king_falcon@hotmail.com' });

//         expect(res.status).toBe(500);
//         expect(res.body).toHaveProperty('error', 'Could not update user');
//     });

//     test('PATCH /users/:id returns 500 on error', async () => {
//         mockDb.select.mockRejectedValue(new Error('DB error'));
//         const res = await request(app)
//             .patch('/users/1')
//             .send({ username: 'Falcon', email: 'king_falcon@hotmail.com' });

//         expect(res.status).toBe(500);
//         expect(res.body).toHaveProperty('error', 'Could not update user');
//     });

//     test('DELETE /users/:id returns 500 on error', async () => {
//         mockDb.remove.mockRejectedValue(new Error('DB error'));
//         const res = await request(app).delete('/users/1');

//         expect(res.status).toBe(500);
//         expect(res.body).toHaveProperty('error', 'Could not delete user');
//     });

//     test('GET /users?email= triggers 500 on db error', async () => {
//         mockDb.select.mockRejectedValue(new Error('DB error'));

//         const res = await request(app).get('/users?email=test@mail.com');

//         expect(res.status).toBe(500);
//         expect(res.body).toHaveProperty('error');
//     });
// });
