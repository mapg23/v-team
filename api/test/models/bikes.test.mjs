import createBikes, { validateZone } from '../../src/models/bikes.mjs';

const mockDb = {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
};

let bikes;

const scooterFields = [
    'id',
    'status',
    'battery',
    'longitude',
    'latitude',
    'occupied',
    'city_id',
    'current_zone_type',
    'current_zone_id'
];

beforeEach(() => {
    jest.clearAllMocks();
    bikes = createBikes(mockDb);
});

describe("bikes model", () => {
    test("getBikes returns bike list", async () => {
        mockDb.select.mockResolvedValue([
            {
                id: 1,
                status: 10,
                battery: 100,
                longitude: 14.16,
                latitude: 57.77,
                occupied: 0,
                city_id: 1,
                current_zone_type: null,
                current_zone_id: null
            }
        ]);

        const result = await bikes.getBikes();

        expect(result).toEqual([
            {
                id: 1,
                status: 10,
                battery: 100,
                longitude: 14.16,
                latitude: 57.77,
                occupied: 0,
                city_id: 1,
                current_zone_type: null,
                current_zone_id: null
            }
        ]);

        expect(mockDb.select).toHaveBeenCalledWith(
            'scooters',
            scooterFields
        );
    });

    test("createBike inserts bike", async () => {
        mockDb.insert.mockResolvedValue({ insertId: 5 });

        const body = {
            status: 10,
            battery: 100,
            longitude: 14.16,
            latitude: 57.77,
            occupied: 0,
            city_id: 1,
            current_zone_type: null,
            current_zone_id: null
        };

        const result = await bikes.createBike(body);

        expect(result).toEqual({ insertId: 5 });
        expect(mockDb.insert).toHaveBeenCalledWith('scooters', body);
    });

    test("getBikeById fetches single bike", async () => {
        mockDb.select.mockResolvedValue([
            {
                id: 5,
                status: 10,
                battery: 100,
                longitude: 14.16,
                latitude: 57.77,
                occupied: 0,
                city_id: 1,
                current_zone_type: 'parking',
                current_zone_id: 2
            }
        ]);

        const result = await bikes.getBikeById(5);

        expect(result).toEqual([
            {
                id: 5,
                status: 10,
                battery: 100,
                longitude: 14.16,
                latitude: 57.77,
                occupied: 0,
                city_id: 1,
                current_zone_type: 'parking',
                current_zone_id: 2
            }
        ]);

        expect(mockDb.select).toHaveBeenCalledWith(
            'scooters',
            scooterFields,
            'id = ?',
            [5]
        );
    });

    test("getBikesByCityId fetches bikes in city", async () => {
        mockDb.select.mockResolvedValue([
            {
                id: 3,
                status: 10,
                battery: 80,
                longitude: 14.16,
                latitude: 57.78,
                occupied: 0,
                city_id: 2,
                current_zone_type: null,
                current_zone_id: null
            }
        ]);

        const result = await bikes.getBikesByCityId(2);

        expect(result).toEqual([
            {
                id: 3,
                status: 10,
                battery: 80,
                longitude: 14.16,
                latitude: 57.78,
                occupied: 0,
                city_id: 2,
                current_zone_type: null,
                current_zone_id: null
            }
        ]);

        expect(mockDb.select).toHaveBeenCalledWith(
            'scooters',
            scooterFields,
            'city_id = ?',
            [2]
        );
    });

    test("updateBike updates a bike", async () => {
        mockDb.update.mockResolvedValue({ affectedRows: 1 });

        const data = { battery: 90 };
        const result = await bikes.updateBike(8, data);

        expect(result).toEqual({ affectedRows: 1 });
        expect(mockDb.update).toHaveBeenCalledWith(
            'scooters',
            data,
            'id = ?',
            [8]
        );
    });

    test("deleteBike removes a bike", async () => {
        mockDb.remove.mockResolvedValue({ affectedRows: 1 });

        const result = await bikes.deleteBike(22);

        expect(result).toEqual({ affectedRows: 1 });
        expect(mockDb.remove).toHaveBeenCalledWith(
            'scooters',
            'id = ?',
            [22]
        );
    });
});

describe("validateZone", () => {
    test("returns true for free parking (no zone type)", async () => {
        const result = await validateZone(null, null, 1, mockDb);
        expect(result).toBe(true);
    });

    test("valid charging zone returns true", async () => {
        mockDb.select.mockResolvedValue([{ id: 1 }]);

        const result = await validateZone('charging', 1, 2, mockDb);

        expect(result).toBe(true);
        expect(mockDb.select).toHaveBeenCalledWith(
            'charging_zones',
            ['id'],
            'id = ? AND city_id = ?',
            [1, 2]
        );
    });

    test("invalid charging zone returns false", async () => {
        mockDb.select.mockResolvedValue([]);

        const result = await validateZone('charging', 99, 2, mockDb);
        expect(result).toBe(false);
    });

    test("valid parking zone returns true", async () => {
        mockDb.select.mockResolvedValue([{ id: 5 }]);

        const result = await validateZone('parking', 5, 1, mockDb);

        expect(result).toBe(true);
        expect(mockDb.select).toHaveBeenCalledWith(
            'parking_zones',
            ['id'],
            'id = ? AND city_id = ?',
            [5, 1]
        );
    });

    test("invalid zone type returns false", async () => {
        const result = await validateZone('invalid', 1, 1, mockDb);
        expect(result).toBe(false);
    });
});
