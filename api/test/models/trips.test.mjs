import { jest } from "@jest/globals";
jest.mock("../../src/database.mjs", () => ({
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
}));

import db from "../../src/database.mjs";
import trips from '../../src/models/trips.mjs';

describe('Trips Model', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('createTrip', async () => {
        db.insert.mockResolvedValue([{insertId: 1}]);
        const body = {
            user_id: 1,
            scooter_id: 2
        };
        const res = await trips.createTrip(body);

        expect(res).toEqual([{'insertId': 1}]);
        expect(db.insert).toHaveBeenCalledWith(
            'trips',
            {
                user_id: 1,
                scooter_id: 2
            }
        );
    });

    test('getTripById returns a trip by ID', async () => {
        db.select.mockResolvedValue([
            {
                id: 5,
                start_lat: 59,
                start_long: 18,
                end_lat: 58,
                end_long: 17,
                start_time: "1234 12 12 00:12:12",
                end_time: "1234 12 12 00:12:13",
                cost: 1,
            }
        ]);
        const res = await trips.getTripById(5);

        expect(res[0]).toHaveProperty('id', 5);
        expect(db.select).toHaveBeenCalledWith(
            'trips',
            "*",
            'id = ?',
            [5]
        );
    });

    test('getTripsByUserId returns trips for a user', async () => {
        const data = [{
            id: 5,
            user_id: 2,
            start_lat: 59,
            start_long: 18,
            end_lat: 58,
            end_long: 17,
            start_time: "1234 12 12 00:12:12",
            end_time: "1234 12 12 00:12:13",
            cost: 1,
        },
        {
            id: 6,
            user_id: 2,
            start_lat: 59,
            start_long: 18,
            end_lat: 58,
            end_long: 17,
            start_time: "1234 12 24 00:12:12",
            end_time: "1234 12 24 00:12:13",
            cost: 1,
        }];

        db.select.mockResolvedValue(data);
        const res = await trips.getTripsByUserId(2);

        expect(res[0] && res[1]).toHaveProperty('user_id', 2);
        expect(db.select).toHaveBeenCalledWith(
            'trips',
            "*",
            'user_id = ?',
            [2]
        );
    });

    // test('updateTrip updates a trip', async () => {
    //     db.update.mockResolvedValueOnce({ affectedRows: 1 });

    //     const res = await trips.updateTrip(5, { cost: 60 });

    //     expect(res).toHaveProperty('affectedRows', 1);
    //     expect(db.update).toHaveBeenCalledWith(
    //         'trips',
    //         { cost: 60 },
    //         'id = ?',
    //         [5]
    //     );
    // });

    test('deleteParking deletes a parking zone', async () => {
        db.remove.mockResolvedValue({ affectedRows: 1 });
        const res = await trips.deleteTrip(5);

        expect(res).toHaveProperty('affectedRows', 1);
        expect(db.remove).toHaveBeenCalledWith('trips', 'id = ?', [5]);
    });
});
