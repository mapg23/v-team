import tripRoutes from "../../src/routes/tripRoutes.mjs";

import request from 'supertest';
import express from 'express';

// https://jestjs.io/docs/mock-functions#mocking-partials
// __esModule: true, have to be there when doing default exports?
jest.mock("../../src/services/tripService.mjs", () => ({
    __esModule: true,
    default: {
        startTrip: jest.fn(),
        endTrip: jest.fn(),
    }
}));

jest.mock("../../src/models/trips.mjs", () => ({
    __esModule: true,
    default: {
        getTripById: jest.fn(),
        getTripsByUserId: jest.fn(),
        deleteTrip: jest.fn(),
    }
}));

import tripService from "../../src/services/tripService.mjs";
import trips from "../../src/models/trips.mjs";

const app = express();

app.use(express.json());
app.use('/trips', tripRoutes);

// Silence the error-logs
beforeAll(() => {
    console.error = jest.fn();
});


describe('Trips routes', () =>{
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("POST / Fail: faulty userId", async () => {
        const tripMock = {
            id: 1,
            user_id: 2,
            scooter_id: 3,
            cost: 0,
            start_lat: 57.0000,
            start_long: 15.0000
        };

        tripService.startTrip.mockResolvedValue([tripMock]);

        const res = await request(app).post("/trips").send({userId: "a", bikeId: 3});

        expect(res.body).toEqual(
            {"errors":
                [
                    {
                        "location": "body",
                        "msg": "User ID must be a positive integer",
                        "path": "userId",
                        "type": "field",
                        "value": "a"
                    }
                ]
            }
        );
        expect(res.status).toEqual(400);
    });

    test("POST / creates a trip", async () => {
        const tripMock = {
            id: 1,
            user_id: 2,
            scooter_id: 3,
            cost: 0,
            start_lat: 57.0000,
            start_long: 15.0000
        };

        tripService.startTrip.mockResolvedValue([tripMock]);

        const res = await request(app).post("/trips").send({userId: 2, bikeId: 3});

        expect(res.body).toEqual([tripMock]);
        expect(res.status).toEqual(201);
    });

    test("POST / creates a trip Fail: backend Error thrown", async () => {
        tripService.startTrip.mockRejectedValue(new Error("Trip could not be created"));


        const res = await request(app).post("/trips").send({userId: 999, bikeId: 3});

        expect(res.body).toEqual({
            "error": "Could not create trip",
            message: "Trip could not be created"
        });
        expect(res.status).toEqual(500);
    });


    test("PUT / end a trip", async () => {
        const endedTrip = {
            id: 5,
            cost: "120.00"
        };

        tripService.endTrip.mockResolvedValue([endedTrip]);

        const res = await request(app).put("/trips/1");

        expect(res.body).toEqual([endedTrip]);
        expect(res.status).toEqual(200);
        expect(tripService.endTrip).toHaveBeenCalledWith("1");
    });

    test("PUT / end a trip Fail: backend Error thrown", async () => {
        tripService.endTrip.mockRejectedValue(new Error("Could not end trip with id: 999"));


        const res = await request(app).put("/trips/999");

        expect(res.body).toEqual({
            error: "Could not end trip with id: 999",
            "message": "Could not end trip with id: 999",
        });
        expect(res.status).toEqual(500);
    });

    test("DELETE /:id delete trip", async () => {
        trips.deleteTrip.mockResolvedValue({ affectedRows: 1 });

        const res = await request(app)
            .delete("/trips/10");

        expect(res.status).toBe(204);
    });

    test("DELETE /:id  returns 404 if not found", async () => {
        trips.deleteTrip.mockResolvedValue({ affectedRows: 0 });

        const res = await request(app)
            .delete("/trips/999");

        expect(res.status).toBe(404);
        expect(res.body).toEqual({error: `Could not find trip with id: 999`});
    });
}


);
