import createParkings from '../../src/models/parkings.mjs';

describe('Parkings Model', () => {
    const mockDb = {
        select: jest.fn(),
        insert: jest.fn(),
        update: jest.fn(),
        remove: jest.fn()
    };

    const parkings = createParkings(mockDb);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('getParkings returns all parking zones', async () => {
        mockDb.select.mockResolvedValue([
            {
                id: 1,
                city_id: 2,
                max_lat: 59,
                max_long: 18,
                min_lat: 58,
                min_long: 17
            }
        ]);
        const res = await parkings.getParkings();

        expect(res[0]).toHaveProperty('id', 1);
        expect(mockDb.select).toHaveBeenCalledWith(
            'parking_zones',
            ['id', 'city_id', 'max_lat', 'max_long', 'min_lat', 'min_long']
        );
    });

    test('createParking inserts a parking zone', async () => {
        mockDb.insert.mockResolvedValue({ insertId: 10 });
        const res = await parkings.createParking(
            {
                city_id: 1,
                max_lat: 59,
                max_long: 18,
                min_lat: 58,
                min_long: 17
            }
        );

        expect(res).toHaveProperty('insertId', 10);
        expect(mockDb.insert).toHaveBeenCalledWith('parking_zones',
            {
                city_id: 1,
                max_lat: 59,
                max_long: 18,
                min_lat: 58,
                min_long: 17
            });
    });

    test('getParkingById returns a parking zone by ID', async () => {
        mockDb.select.mockResolvedValue([
            {
                id: 5,
                city_id: 2,
                max_lat: 59,
                max_long: 18,
                min_lat: 58,
                min_long: 17
            }
        ]);
        const res = await parkings.getParkingById(5);

        expect(res[0]).toHaveProperty('id', 5);
        expect(mockDb.select).toHaveBeenCalledWith(
            'parking_zones',
            ['id', 'city_id', 'max_lat', 'max_long', 'min_lat', 'min_long'],
            'id = ?',
            [5]
        );
    });

    test('getParkingsByCityId returns parking zones for a city', async () => {
        mockDb.select.mockResolvedValue([
            {
                id: 1,
                city_id: 2,
                max_lat: 59,
                max_long: 18,
                min_lat: 58,
                min_long: 17
            }
        ]);
        const res = await parkings.getParkingsByCityId(2);

        expect(res[0]).toHaveProperty('city_id', 2);
        expect(mockDb.select).toHaveBeenCalledWith(
            'parking_zones',
            ['id', 'city_id', 'max_lat', 'max_long', 'min_lat', 'min_long'],
            'city_id = ?',
            [2]
        );
    });

    test('updateParking updates a parking zone', async () => {
        mockDb.update.mockResolvedValue({ affectedRows: 1 });
        const res = await parkings.updateParking(5, { max_lat: 60 });

        expect(res).toHaveProperty('affectedRows', 1);
        expect(mockDb.update).toHaveBeenCalledWith('parking_zones',
            { max_lat: 60 }, 'id = ?', [5]);
    });

    test('deleteParking deletes a parking zone', async () => {
        mockDb.remove.mockResolvedValue({ affectedRows: 1 });
        const res = await parkings.deleteParking(5);

        expect(res).toHaveProperty('affectedRows', 1);
        expect(mockDb.remove).toHaveBeenCalledWith('parking_zones', 'id = ?', [5]);
    });
});
