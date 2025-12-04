
import request from 'supertest';
import express from 'express';
import createUserRouter from '../../src/routes/userRoutes.mjs';
import createUsers from '../../src/models/users.mjs';

// Mockar databasen
const mockDb = {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
};

// Skapar users-objektet med mocken
const users = createUsers(mockDb);

// Skapar app och montera routern
const app = express();

app.use(express.json());
app.use(createUserRouter(users));

// Testerna
describe('Users API - ok', () => {
    // Byter ut console.error mot en tom funktion, Inget skrivs till terminalen.
    beforeAll(() => {
        console.error = jest.fn();
    });
    test('POST /users creates a user', async () => {
        mockDb.insert.mockResolvedValue({ insertId: 1 });
        mockDb.select.mockResolvedValue(
            [{
                id: 1,
                username: 'Falcon',
                email: 'falcon@hotmail.com',
                password: 'secret'
            }]
        );
        const res = await request(app)
            .post('/users')
            .send({ username: 'Falcon',
                email: 'falcon@hotmail.com',
                password: 'secret'
            });

        expect(res.status).toBe(201);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0].username).toBe('Falcon');
        expect(res.body[0].email).toBe('falcon@hotmail.com');
    });

    test('GET /users/:id returns a user', async () => {
        mockDb.select.mockResolvedValue([
            { id: 1, username: "test", email: "test@hotmail.com" }
        ]);
        const res = await request(app).get('/users/1');

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id', 1);
    });

    test('GET /users/ returns users', async () => {
        mockDb.select.mockResolvedValue([
            { id: 1, username: "Falcon", email: "falcon@hotmail.com" }
        ]);
        const res = await request(app).get('/users');

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id', 1);
        expect(res.body[0]).toHaveProperty('username', 'Falcon');
        expect(res.body[0]).toHaveProperty('email', 'falcon@hotmail.com');
    });

    test('PUT /users/:id update a user', async () => {
        mockDb.select.mockResolvedValue([
            { id: 1, username: "Falcon Bird", email: "king_falcon@hotmail.com" }
        ]);
        const res = await request(app)
            .put('/users/1')
            .send({ username: 'Falcon Bird', email: 'king_falcon@hotmail.com' });

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0].username).toBe('Falcon Bird');
        expect(res.body[0].email).toBe('king_falcon@hotmail.com');
    });

    test('PATCH /users/:id update a part of a user', async () => {
        mockDb.select.mockResolvedValue([
            { id: 1, username: "Falcon", email: "king_falcon@hotmail.com" }
        ]);
        const res = await request(app)
            .patch('/users/1')
            .send({ username: 'Falcon', email: 'king_falcon@hotmail.com' });

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0].username).toBe('Falcon');
        expect(res.body[0].email).toBe('king_falcon@hotmail.com');
    });

    test('DELETE /users/:id delete a user', async () => {
        const res = await request(app)
            .delete('/users/1');

        expect(res.status).toBe(204);
    });

    test('GET /users?email returns user by email', async () => {
        mockDb.select.mockResolvedValue([
            { id: 1, username: "Falcon", email: "falcon@hotmail.com" }
        ]);

        const res = await request(app).get('/users?email=falcon@hotmail.com');

        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('id', 1);
        expect(res.body[0]).toHaveProperty('email', 'falcon@hotmail.com');
    });
});

// De negativa fallen
describe('Users API - NOK (500) and (400)', () => {
    // Byter ut console.error mot en tom funktion, Inget skrivs till terminalen.
    beforeAll(() => {
        console.error = jest.fn();
    });
    test('POST /users returns 500 on error', async () => {
        mockDb.insert.mockRejectedValue(new Error('DB error'));
        const res = await request(app)
            .post('/users')
            .send({ username: 'Falcon',
                email: 'falcon@hotmail.com',
                password: 'secret' });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error', 'Could not create user');
    });

    test('GET /users/:id returns 500 on error', async () => {
        mockDb.select.mockRejectedValue(new Error('DB error'));
        const res = await request(app).get('/users/1');

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error', 'Could not fetch user');
    });

    test('GET /users returns 500 on error', async () => {
        mockDb.select.mockRejectedValue(new Error('DB error'));
        const res = await request(app).get('/users');

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error', 'Could not fetch users');
    });

    test('PUT /users/:id returns 500 on error', async () => {
        mockDb.select.mockRejectedValue(new Error('DB error'));
        const res = await request(app)
            .put('/users/1')
            .send({ username: 'Falcon Bird', email: 'king_falcon@hotmail.com' });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error', 'Could not update user');
    });

    test('PATCH /users/:id returns 500 on error', async () => {
        mockDb.select.mockRejectedValue(new Error('DB error'));
        const res = await request(app)
            .patch('/users/1')
            .send({ username: 'Falcon', email: 'king_falcon@hotmail.com' });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error', 'Could not update user');
    });

    test('DELETE /users/:id returns 500 on error', async () => {
        mockDb.remove.mockRejectedValue(new Error('DB error'));
        const res = await request(app).delete('/users/1');

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error', 'Could not delete user');
    });

    test('GET /users?email= triggers 500 on db error', async () => {
        mockDb.select.mockRejectedValue(new Error('DB error'));

        const res = await request(app).get('/users?email=test@mail.com');

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});

// Negativa tester för 400
describe('Users API - NOK (400)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Saknade fält
    test('POST /users returns 400 if required fields are missing', async () => {
        const res = await request(app)
            .post('/users')
            .send({ email: 'falcon@hotmail.com' }); // saknar username & password

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Missing required fields');
    });

    // Ogiltigt emailformat
    test('POST /users returns 400 if email format is invalid', async () => {
        const res = await request(app)
            .post('/users')
            .send({ username: 'Falcon', email: 'falcon-at-hotmail.com', password: 'secret' });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Invalid email format');
    });

    // Ogiltigt eller saknat id
    test('GET /users/:id returns 400 if id is invalid', async () => {
    // id som inte är nummer.
        const res = await request(app).get('/users/abc');

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Id is wrong');
    });

    test('PUT /users/:id returns 400 if id is invalid', async () => {
        const res = await request(app)
            .put('/users/abc')
            .send({ username: 'Falcon', email: 'falcon@hotmail.com' });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Id is wrong');
    });

    test('PATCH /users/:id returns 400 if id is invalid', async () => {
        const res = await request(app)
            .patch('/users/abc')
            .send({ username: 'Falcon' });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Id is wrong');
    });

    test('DELETE /users/:id returns 400 if id is invalid', async () => {
        const res = await request(app).delete('/users/abc');

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Id is wrong');
    });
});
