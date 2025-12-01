
import createUsers from '../../src/models/users.mjs';

const mockDb = {
  select: jest.fn().mockResolvedValue([{ id: 1, username: 'test', email: 'test@hotmail.com' }]),
  insert: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const users = createUsers(mockDb);

test('getUsers returning list', async () => {
  const result = await users.getUsers();
  expect(result).toEqual([{ id: 1, username: 'test', email: 'test@hotmail.com' }]);
  expect(mockDb.select).toHaveBeenCalledWith('users', ['id', 'username', 'email']);
});
