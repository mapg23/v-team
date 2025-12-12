import createBikes from '../../src/models/bikes.mjs';

const mockDb = {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
};

let bikes;

beforeEach(() => {
    jest.clearAllMocks();
    bikes = createBikes(mockDb);
});

describe("bikes model", () => {
    test("getBikes returns bike list", async () => {
        mockDb.select.mockResolvedValue([
            { id: 1, status: 10, battery: 100, location: "57.77,14.16", occupied: 0, city_id: 1 }
        ]);

        const result = await bikes.getBikes();

        expect(result).toEqual([
            { id: 1, status: 10, battery: 100, location: "57.77,14.16", occupied: 0, city_id: 1 }
        ]);

        expect(mockDb.select).toHaveBeenCalledWith(
            'scooters',
            ['id', 'status', 'battery', 'location', 'occupied', 'city_id']
        );
    });

    test("createBike inserts bike", async () => {
        mockDb.insert.mockResolvedValue({ insertId: 5 });

        const body = { status: 10, battery: 100, location: "57.77,14.16", occupied: 0, city_id: 1 };
        const result = await bikes.createBike(body);

        expect(result).toEqual({ insertId: 5 });
        expect(mockDb.insert).toHaveBeenCalledWith('scooters', body);
    });

    test("getBikeById fetches single bike", async () => {
        mockDb.select.mockResolvedValue([
            { id: 5, status: 10, battery: 100, location: "57.77,14.16", occupied: 0, city_id: 1 }
        ]);

        const result = await bikes.getBikeById(5);

        expect(result).toEqual([
            { id: 5, status: 10, battery: 100, location: "57.77,14.16", occupied: 0, city_id: 1 }
        ]);

        expect(mockDb.select).toHaveBeenCalledWith(
            'scooters',
            ['id', 'status', 'battery', 'location', 'occupied', 'city_id'],
            'id = ?',
            [5]
        );
    });

    test("getBikesByCityId fetches bikes in city", async () => {
        mockDb.select.mockResolvedValue([
            { id: 3, status: 10, battery: 80, location: "57.78,14.16", occupied: 0, city_id: 2 }
        ]);

        const result = await bikes.getBikesByCityId(2);

        expect(result).toEqual([
            { id: 3, status: 10, battery: 80, location: "57.78,14.16", occupied: 0, city_id: 2 }
        ]);

        expect(mockDb.select).toHaveBeenCalledWith(
            'scooters',
            ['id', 'status', 'battery', 'location', 'occupied', 'city_id'],
            'city_id = ?',
            [2]
        );
    });

    test("updateBike updates a bike", async () => {
        mockDb.update.mockResolvedValue({ affectedRows: 1 });

        const data = { battery: 90 };
        const result = await bikes.updateBike(8, data);

        expect(result).toEqual({ affectedRows: 1 });
        expect(mockDb.update).toHaveBeenCalledWith('scooters', data, 'id = ?', [8]);
    });

    test("deleteBike removes a bike", async () => {
        mockDb.remove.mockResolvedValue({ affectedRows: 1 });

        const result = await bikes.deleteBike(22);

        expect(result).toEqual({ affectedRows: 1 });
        expect(mockDb.remove).toHaveBeenCalledWith('scooters', 'id = ?', [22]);
    });
});
