
import createUsers from '../../src/models/users.mjs';

const mockDb = {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
};

let users;

beforeEach(() => {
    jest.clearAllMocks();
    // Använda mockDb i varje test
    users = createUsers(mockDb);
});

describe("users model", () => {
    test("getUsers returns user list", async () => {
        mockDb.select.mockResolvedValue([
            { id: 1, username: "test", email: "test@hotmail.com" }
        ]);

        const result = await users.getUsers();

        expect(result).toEqual([
            { id: 1, username: "test", email: "test@hotmail.com" }
        ]);

        expect(mockDb.select).toHaveBeenCalledWith(
            "users",
            ["id", "username", "email"]
        );
    });

    test("createUser inserts user", async () => {
        mockDb.insert.mockResolvedValue({ insertId: 5 });

        const body = { username: "Falcon", email: "falcon@hotmail.com" };
        const result = await users.createUser(body);

        expect(result).toEqual({ insertId: 5 });
        expect(mockDb.insert).toHaveBeenCalledWith("users", body);
    });

    test("getUserById fetches single user", async () => {
        mockDb.select.mockResolvedValue([
            { id: 5, username: "Falcon", email: "falcon@hotmail.com" }
        ]);

        const result = await users.getUserById(5);

        expect(result).toEqual([
            { id: 5, username: "Falcon", email: "falcon@hotmail.com" }
        ]);

        expect(mockDb.select).toHaveBeenCalledWith(
            "users",
            ["id", "username", "email", "role"],
            "id = ?",
            [5]
        );
    });

    test("getUserByEmail fetches by email", async () => {
        mockDb.select.mockResolvedValue([
            { id: 3, username: "Eagle", email: "eagle@hotmail.com" }
        ]);

        const result = await users.getUserByEmail("eagle@hotmail.com");

        expect(result).toEqual([
            { id: 3, username: "Eagle", email: "eagle@hotmail.com" }
        ]);

        expect(mockDb.select).toHaveBeenCalledWith(
            "users",
            ["*"],
            "email = ?",
            ["eagle@hotmail.com"]
        );
    });

    test("updateUser updates a user", async () => {
        mockDb.update.mockResolvedValue({ affectedRows: 1 });

        const data = { email: "newEmail@hotmail.com" };
        const result = await users.updateUser(8, data);

        expect(result).toEqual({ affectedRows: 1 });

        expect(mockDb.update).toHaveBeenCalledWith(
            "users",
            data,
            "id = ?",
            [8]
        );
    });

    test("deleteUser removes user", async () => {
        mockDb.remove.mockResolvedValue({ affectedRows: 1 });

        const result = await users.deleteUser(22);

        expect(result).toEqual({ affectedRows: 1 });

        expect(mockDb.remove).toHaveBeenCalledWith(
            "users",
            "id = ?",
            [22]
        );
    });
});
