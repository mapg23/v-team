import createStations from '../../src/models/stations.mjs';

const mockDb = {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
};

let stations;

beforeEach(() => {
    jest.clearAllMocks();
    stations = createStations(mockDb);
});

describe("stations model", () => {
    test("getStations returns station list", async () => {
        mockDb.select.mockResolvedValue([
            {
                id: 1,
                city_id: 1,
                name: "Station A",
                latitude: 59.33,
                longitude: 18.06,
                capacity: 10
            }
        ]);

        const result = await stations.getStations();

        expect(result).toEqual([
            {
                id: 1,
                city_id: 1,
                name: "Station A",
                latitude: 59.33,
                longitude: 18.06,
                capacity: 10
            }
        ]);

        expect(mockDb.select).toHaveBeenCalledWith(
            'charging_zones',
            ['id', 'city_id', 'name', 'latitude', 'longitude', 'capacity']
        );
    });

    test("createStation inserts a station", async () => {
        mockDb.insert.mockResolvedValue({ insertId: 5 });

        const body =
        {
            city_id: 1,
            name: "Station B",
            latitude: 59.34,
            longitude: 18.07,
            capacity: 15
        };
        const result = await stations.createStation(body);

        expect(result).toEqual({ insertId: 5 });
        expect(mockDb.insert).toHaveBeenCalledWith("charging_zones", body);
    });

    test("getStationById fetches single station", async () => {
        mockDb.select.mockResolvedValue([
            {
                id: 5,
                city_id: 1,
                name: "Station C",
                latitude: 59.35,
                longitude: 18.08,
                capacity: 12
            }
        ]);

        const result = await stations.getStationById(5);

        expect(result).toEqual([
            {
                id: 5,
                city_id: 1,
                name: "Station C",
                latitude: 59.35,
                longitude: 18.08,
                capacity: 12
            }
        ]);

        expect(mockDb.select).toHaveBeenCalledWith(
            "charging_zones",
            ['id', 'city_id', 'name', 'latitude', 'longitude', 'capacity'],
            "id = ?",
            [5]
        );
    });

    test("getStationsByCityId fetches stations by city", async () => {
        mockDb.select.mockResolvedValue([
            {
                id: 3,
                city_id: 2,
                name: "Station D",
                latitude: 59.36,
                longitude: 18.09,
                capacity: 20
            }
        ]);

        const result = await stations.getStationsByCityId(2);

        expect(result).toEqual([
            {
                id: 3,
                city_id: 2,
                name: "Station D",
                latitude: 59.36,
                longitude: 18.09,
                capacity: 20
            }
        ]);

        expect(mockDb.select).toHaveBeenCalledWith(
            "charging_zones",
            ['id', 'city_id', 'name', 'latitude', 'longitude', 'capacity'],
            "city_id = ?",
            [2]
        );
    });

    test("updateStation updates a station", async () => {
        mockDb.update.mockResolvedValue({ affectedRows: 1 });

        const data = { capacity: 25 };
        const result = await stations.updateStation(8, data);

        expect(result).toEqual({ affectedRows: 1 });
        expect(mockDb.update).toHaveBeenCalledWith(
            "charging_zones",
            data,
            "id = ?",
            [8]
        );
    });

    test("deleteStation removes a station", async () => {
        mockDb.remove.mockResolvedValue({ affectedRows: 1 });

        const result = await stations.deleteStation(22);

        expect(result).toEqual({ affectedRows: 1 });
        expect(mockDb.remove).toHaveBeenCalledWith(
            "charging_zones",
            "id = ?",
            [22]
        );
    });
});
