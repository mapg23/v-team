"use strict";
import { getApiBase } from "../apiUrl";

const API = getApiBase();

const TripsModel = {
    basicGet: async function basicGet(url) {
        const token = sessionStorage.getItem("jwt");
        try {
            const response = await fetch(`${API}${url}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(
                    `(${response.status}) Response not ok url: ${API}${url}`
                );
            }

            return await response.json();

        } catch (error) {
            console.error(`Basic GET fetch failed url: ${url}`);
            console.error(error);
            return { error: true };
        }
    },

    basicPOST: async function basicPOST(url, data) {
        const token = sessionStorage.getItem("jwt");
        try {
            const response = await fetch(
                `${API}${url}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(
                    `(${response.status}) Response not ok url: ${API}${url}`
                );
            }

            return await response.json();

        } catch (error) {
            console.error(`Basic GET fetch failed url: ${url}`);
            console.error(error);
            return { error: true };
        }
    },

    basicPUT: async function basicPUT(url, data) {
        const token = sessionStorage.getItem("jwt");
        try {
            const response = await fetch(
                `${API}${url}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(
                    `(${response.status}) Response not ok url: ${API}${url}`
                );
            }

            return await response.json();

        } catch (error) {
            console.error(`Basic PUT fetch failed url: ${url}`);
            console.error(error);
            return { error: true };
        }
    },

    getTripsByID: async function getTripsByID(id) {
        return await this.basicGet(`/trips/user/${id}`);
    },


    getTripsByTripsID: async function getTripsByID(id) {
        return await this.basicGet(`/trips/${id}`);
    },

    startTrip: async function startTrip(userId, bikeId) {
        let res = await this.basicPOST(`/trips/start`, {
            "userId": userId,
            "bikeId": bikeId
        });

        return res;
    },

    getBikeInfo: async function getBikeInfo(bikeId) {
        return await this.basicGet(`/bikes/${bikeId}`);
    },

    endTrip: async function endTrip(bikeId) {
        return await this.basicPOST(`/trips/bike/${bikeId}/end`, {});
    },

    getCurrentCost: async function getCurrentCost(bikeId) {
        return await this.basicGet(`/bike/${bikeId}/current-cost`);
    }
}


export default TripsModel;