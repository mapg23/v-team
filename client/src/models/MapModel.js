"use strict";
import { getApiBase } from "../apiUrl";

const API = getApiBase();

const MapModel = {
    basicGet: async function basicGet(url) {
        try {
            const response = await fetch(`${API}${url}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
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
        try {
            const response = await fetch(
                `${API}${url}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
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

    getCityDetailsByID: async function getCityDetailsByID(id) {
        return await this.basicGet(`/cities/${id}`);
    },

    getParkingZonesInCity: async function getParkingZonesInCity(cityId) {
        return await this.basicGet(`/cities/${cityId}/parkings`);
    },

    getChargingStationsInCity: async function getChargingStationsInCity(cityId) {
        return await this.basicGet(`/cities/${cityId}/stations`);
    },

    startBikeSync: async function startBikeSync() {
        console.log("Bike services has been called!");

        return await this.basicGet(`/bikes/sync`);
    }

}


export default MapModel;