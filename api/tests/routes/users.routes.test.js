
import request from 'supertest';
import express from 'express';
import createUserRouter from '../../src/routes/userRoutes.mjs';
import createUsers from '../../src/models/users.mjs';

// Mockar databasen
const mockDb = {
  select: jest.fn().mockResolvedValue([{ id: 1, username: 'Falcon', email: 'falcon@hotmail.com' }]),
  insert: jest.fn().mockResolvedValue({ insertId: 1 }),
  update: jest.fn().mockResolvedValue({ affectedRows: 1 }),
  remove: jest.fn().mockResolvedValue({ affectedRows: 1 }),
};

// Skapar users-objektet med mocken
const users = createUsers(mockDb);

// Skapar app och montera routern
const app = express();
app.use(express.json());
app.use(createUserRouter(users));

// Testerna
describe('Users API', () => {
  test('POST /users creates a user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ username: 'Falcon', email: 'falcon@hotmail.com' });

    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0].username).toBe('Falcon');
  });

  test('GET /users/:id returns a user', async () => {
    const res = await request(app).get('/users/1');

    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty('id', 1);
  });
});
