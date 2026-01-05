"use strict";
import { getApiBase } from "../apiUrl";
import { jwtDecode } from "jwt-decode";


const API = getApiBase();

const UserModel = {
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

    protectedGet: async function protectedGet(url) {
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

        sessionStorage.setItem("jwt", response["jwt"]);
        const payload = jwtDecode(response["jwt"]);
        const userId = payload.sub.userId;

        return userId;
    },

    getUserById: async function getUserById(id) {
        return await this.protectedGet(`/users/${id}`);
    },

    getUserBalance: async function getUserBalance(id) {
        // TODO: KOPPLA TILL API
    }
}


export default UserModel;