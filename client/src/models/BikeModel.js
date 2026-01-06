"use strict";
import { getApiBase } from "../apiUrl";

const API = getApiBase();

const BikeModel = {
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

    getBikeById: async function getBikeById(id) {
        return await this.basicGet(`/bikes/${id}`);
    },

    startNewTrip: async function startNewTrip(bikeId, userId) {
        return await this.basicPOST(`/trips`, {
            "userId": userId,
            "bikeId": bikeId
        });
    },

    getTripsByID: async function getTripsByID(id) {
        return await this.basicGet(`/trips/user/${id}`);
    },

    getTripsByTripsID: async function getTripsByID(id) {
        return await this.basicGet(`/trips/${id}`);
    },
}


export default BikeModel;