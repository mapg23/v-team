"use strict";
import { getApiBase } from "../apiUrl";

const API = getApiBase();

const UserModel = {
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
            console.error(`Basic POST fetch failed url: ${url}`);
            console.error(error);
            return { error: true };
        }
    },

    getBikeById: async function getBikeById(id) {
        return await this.basicGet(`/bikes/${id}`);
    },

    registerUser: async function registerUser(params) {

    },

    loginUser: async function loginUser(email, password) {
        const response = await this.basicPOST(`/auth/login`, {
            "email": email,
            "password": password,
            "username": "",
        })

        console.log(response);
    }
}


export default UserModel;