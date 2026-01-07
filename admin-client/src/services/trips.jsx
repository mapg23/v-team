import API from "../config/api.js";

/**
 * TripService handling all routes regarding trips made by users
 * Based on endpoints: https://docs.google.com/spreadsheets/d/1Tza3ZSUOJJRQJeSquKQbE6fRy4d3zNGafAVQxUVNg9M/edit?gid=0#gid=0
 */
const TripService = {
  /**
   * Get trips by user
   * @param {number} userId
   * @returns
   */
  getTripsByUserId: async function getTripsByUserId(userId) {
    const token = sessionStorage.getItem("jwt");
    try {
      const response = await fetch(`${API}/trips/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error on getTripsByuserId! Status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  /**
   * Get all trips
   * @returns json
   */
  getAllTrips: async function getAllTrips() {
    const token = sessionStorage.getItem("jwt");
    try {
      const response = await fetch(`${API}/trips`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error on getAllTrips! Status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  /**
   * Stop a currently running trip
   * @param {num} bikeId the id of the bike to be stopped
   * @returns json
   */
  stopCurrentTrip: async function stopCurrentTrip(bikeId) {
    const token = sessionStorage.getItem("jwt");
    console.log(bikeId)
    try {
      const response = await fetch(`${API}/trips/bike/${bikeId}/end`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error on stopCurrentTrip! Status: ${response.status} ${response.message}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      console.error(error.m);
      return [];
    }
  },
};

export default TripService;
