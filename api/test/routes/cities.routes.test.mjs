import request from 'supertest';
import express from 'express';
import createCityRouter from '../../src/routes/cityRoutes.mjs';
import createCities from '../../src/models/cities.mjs';
import createBikes from '../../src/models/bikes.mjs';
import createStations from '../../src/models/stations.mjs';
import createParkings from '../../src/models/parkings.mjs';
import cityHelpers from '../../src/helpers/validateCity.mjs';

jest.mock('../../src/helpers/validateCity.mjs');

const mockDb = {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
};

cityHelpers.getGeoCoordinates.mockResolvedValue(
    { latitude: 57.78, longitude: 14.15 }
);
cityHelpers.validateId.mockImplementation(
    (id) => (isNaN(Number(id)) ? 'Id is wrong' : undefined));

const cities = createCities(mockDb);
const bikes = createBikes(mockDb);
const stations = createStations(mockDb);
const parkings = createParkings(mockDb);
const app = express();

app.use(express.json());
app.use(createCityRouter(cities, bikes, stations, parkings));

beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
});

describe('POST /cities', () => {
    test('creates a city', async () => {
        cities.getCityByName = jest.fn().mockResolvedValue([]);
        cities.createCity = jest.fn().mockResolvedValue({ insertId: 1 });
        cities.getCityById = jest.fn().mockResolvedValue([
            {
                id: 1,
                name: 'TestCity',
                latitude: 57.78,
                longitude: 14.15
            }
        ]);

        const res = await request(app).post('/cities').send({ name: 'TestCity' });

        expect(res.status).toBe(201);
        expect(res.body[0].name).toBe('TestCity');
    });

    test('returns 400 if body missing', async () => {
        const res = await request(app).post('/cities');

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Request body is missing or empty');
    });

    test('returns 404 if city not found via geocoding', async () => {
        cityHelpers.getGeoCoordinates.mockResolvedValueOnce(null);
        const res = await request(app).post('/cities').send({ name: 'Nowhere' });

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('City not found');
    });

    test('returns 409 if city already exists', async () => {
        cities.getCityByName = jest.fn().mockResolvedValue([{ id: 1 }]);
        const res = await request(app).post('/cities').send({ name: 'TestCity' });

        expect(res.status).toBe(409);
        expect(res.body.error).toBe('City already exists');
    });

    test('returns 500 on DB error', async () => {
        cities.getCityByName = jest.fn().mockResolvedValue([]);
        cities.createCity = jest.fn().mockRejectedValue(new Error('DB error'));
        const res = await request(app).post('/cities').send({ name: 'TestCity' });

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Could not create city');
    });
});

describe('GET /cities', () => {
    test('returns all cities', async () => {
        cities.getCities = jest.fn().mockResolvedValue([{ id: 1, name: 'City' }]);
        const res = await request(app).get('/cities');

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
    });

    test('returns city by name', async () => {
        cities.getCityByName = jest.fn().mockResolvedValue([{ id: 1, name: 'City' }]);
        const res = await request(app).get('/cities?name=City');

        expect(res.status).toBe(200);
        expect(res.body[0].name).toBe('City');
    });

    test('returns 500 on DB error', async () => {
        cities.getCities = jest.fn().mockRejectedValue(new Error('DB error'));
        const res = await request(app).get('/cities');

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Could not fetch cities');
    });
});

describe('GET /cities/:id', () => {
    test('returns city details', async () => {
        cities.getCityDetails = jest.fn().mockResolvedValue({
            id: '1',
            bikeCount: '2',
            stationCount: '1',
            parkingCount: '1'
        });
        const res = await request(app).get('/cities/1');

        expect(res.status).toBe(200);
        expect(res.body.id).toBe(1);
        expect(res.body.bikeCount).toBe(2);
    });

    test('returns 400 for invalid id', async () => {
        const res = await request(app).get('/cities/abc');

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Id is wrong');
    });

    test('returns 404 if city not found', async () => {
        cities.getCityDetails = jest.fn().mockResolvedValue(null);
        const res = await request(app).get('/cities/1');

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('City not found');
    });

    test('returns 500 on DB error', async () => {
        cities.getCityDetails = jest.fn().mockRejectedValue(new Error('DB error'));
        const res = await request(app).get('/cities/1');

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Could not fetch city');
    });
});

describe('PUT /cities/:id', () => {
    test('updates a city', async () => {
        cities.updateCity = jest.fn().mockResolvedValue({});
        cities.getCityById = jest.fn().mockResolvedValue([
            {
                id: 1,
                name: 'Updated'

            }
        ]);
        const res = await request(app).put('/cities/1').send({ name: 'Updated' });

        expect(res.status).toBe(200);
        expect(res.body[0].name).toBe('Updated');
    });

    test('returns 400 if name missing', async () => {
        const res = await request(app).put('/cities/1').send({ name: '' });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Name is missing');
    });

    test('returns 404 if city not found', async () => {
        cities.updateCity = jest.fn().mockResolvedValue({});
        cities.getCityById = jest.fn().mockResolvedValue([]);
        const res = await request(app).put('/cities/1').send({ name: 'Updated' });

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('City not found');
    });

    test('returns 500 on DB error', async () => {
        cities.updateCity = jest.fn().mockRejectedValue(new Error('DB error'));
        const res = await request(app).put('/cities/1').send({ name: 'Updated' });

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Could not update city');
    });
});

describe('DELETE /cities/:id', () => {
    test('deletes a city', async () => {
        cities.deleteCity = jest.fn().mockResolvedValue({});
        const res = await request(app).delete('/cities/1');

        expect(res.status).toBe(204);
    });

    test('returns 400 for invalid id', async () => {
        const res = await request(app).delete('/cities/abc');

        expect(res.status).toBe(400);
    });

    test('returns 500 on DB error', async () => {
        cities.deleteCity = jest.fn().mockRejectedValue(new Error('DB error'));
        const res = await request(app).delete('/cities/1');

        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Could not delete city');
    });
});

describe('City sub-resources', () => {
    test('GET /cities/:id/bikes', async () => {
        bikes.getBikesByCityId = jest.fn().mockResolvedValue(
            [{ id: 1 }, { id: 2 }]
        );
        cities.getCityById = jest.fn().mockResolvedValue([{ id: 1 }]);
        const res = await request(app).get('/cities/1/bikes');

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
    });

    test('GET /cities/:id/stations invalid id', async () => {
        const res = await request(app).get('/cities/abc/stations');

        expect(res.status).toBe(400);
    });

    test('GET /cities/:id/parkings city not found', async () => {
        cities.getCityById = jest.fn().mockResolvedValue([]);
        const res = await request(app).get('/cities/1/parkings');

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('City not found');
    });

    test('GET /cities/:id/bike/:bikeId wrong city', async () => {
        cities.getCityById = jest.fn().mockResolvedValue([{ id: 1 }]);
        bikes.getBikeById = jest.fn().mockResolvedValue(
            [{ id: 2, city_id: 99 }]
        );
        const res = await request(app).get('/cities/1/bike/2');

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Bike not found in this city');
    });
});
