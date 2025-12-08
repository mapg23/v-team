
import createCities from '../../src/models/cities.mjs';

const mockDb = {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
};

let cities;

beforeEach(() => {
    jest.clearAllMocks();
    // Använda mockDb i varje test
    cities = createCities(mockDb);
});

describe("cities model", () => {
    test("getCities returns city list", async () => {
        mockDb.select.mockResolvedValue([
            {
                "id": 1,
                "name": "Jönköping",
                "latitude": 57.781500,
                "longitude": 14.156200
            }
        ]);

        const result = await cities.getCities();

        expect(result).toEqual([
            {
                "id": 1,
                "name": "Jönköping",
                "latitude": 57.781500,
                "longitude": 14.156200
            }
        ]);

        expect(mockDb.select).toHaveBeenCalledWith(
            "cities",
            ["id", "name", "latitude", "longitude"]
        );
    });

    test("createCity inserts city", async () => {
        mockDb.insert.mockResolvedValue({ insertId: 5 });
        const body =
        {
            name: "Bankeryd",
            latitude: 57.860200,
            longitude: 14.124000
        };

        const result = await cities.createCity(body);

        expect(result).toEqual({ insertId: 5 });
        expect(mockDb.insert).toHaveBeenCalledWith("cities", body);
    });

    test("getCityById fetches single city", async () => {
        mockDb.select.mockResolvedValue([
            {
                name: "Bankeryd",
                latitude: 57.860200,
                longitude: 14.124000
            }
        ]);

        const result = await cities.getCityById(5);

        expect(result).toEqual([
            {
                name: "Bankeryd",
                latitude: 57.860200,
                longitude: 14.124000
            }
        ]);

        expect(mockDb.select).toHaveBeenCalledWith(
            "cities",
            ["id", "name", "latitude", "longitude"],
            "id = ?",
            [5]
        );
    });

    test("getCityByName fetches by name", async () => {
        mockDb.select.mockResolvedValue([
            {
                id: 3,
                name: "Bankeryd",
                latitude: 57.860200,
                longitude: 14.124000
            }
        ]);

        const result = await cities.getCityByName("Bankeryd");

        expect(result).toEqual([
            {
                id: 3,
                name: "Bankeryd",
                latitude: 57.860200,
                longitude: 14.124000
            }
        ]);

        expect(mockDb.select).toHaveBeenCalledWith(
            "cities",
            ["id", "name", "latitude", "longitude"],
            "name = ?",
            ["Bankeryd"]
        );
    });

    test("updateCity updates a city", async () => {
        mockDb.update.mockResolvedValue({ affectedRows: 1 });

        const data = { name: "Bankeryd" };
        const result = await cities.updateCity(8, data);

        expect(result).toEqual({ affectedRows: 1 });

        expect(mockDb.update).toHaveBeenCalledWith(
            "cities",
            data,
            "id = ?",
            [8]
        );
    });

    test("deleteCity removes city", async () => {
        mockDb.remove.mockResolvedValue({ affectedRows: 1 });

        const result = await cities.deleteCity(2);

        expect(result).toEqual({ affectedRows: 1 });

        expect(mockDb.remove).toHaveBeenCalledWith(
            "cities",
            "id = ?",
            [2]
        );
    });
});
