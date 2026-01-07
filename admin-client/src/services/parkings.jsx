import API from "../config/api.js";

/**
 * Parking services handling all routes regarding parkings
 * Based on endpoints: https://docs.google.com/spreadsheets/d/1Tza3ZSUOJJRQJeSquKQbE6fRy4d3zNGafAVQxUVNg9M/edit?gid=0#gid=0
 */
const parkingService = {
  /**
   * Add a new parking zone
   * @param {Object} zoneObj
   *
   * {
   *   cityId: number,
   *   maxLat: number,
   *   maxLong: number,
   *   minLat: number,
   *   minLong: number
   * }
   * @return {JSON} array of objects
   */
  addNewParkingZone: async function addNewParkingZone(zoneObj) {
    const token = sessionStorage.getItem("jwt");
    try {
      const response = await fetch(`${API}/parkings`, {
        body: JSON.stringify(zoneObj),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  /**
   * Update parking zone details
   * @return {JSON} array of objects
   */
  updateParkingZone: async function updateParkingZone(parkId) {
    const token = sessionStorage.getItem("jwt");
    try {
      const response = await fetch(`${API}/parkings/${parkId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  /**
   * Delete parking zone
   * @return {JSON} array of objects
   */
  deleteParkingZone: async function deleteParkingZone(parkId) {
    const token = sessionStorage.getItem("jwt");
    try {
      const response = await fetch(`${API}/parkings/${parkId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  /**
   * Get all parking zones
   * @return {JSON} array of objects
   */
  getAllBikesInParkingZone: async function getAllBikesInParkingZone(parkingId) {
    const token = sessionStorage.getItem("jwt");
    try {
      const response = await fetch(`${API}/parkings/${parkingId}/bikes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },
};

export default parkingService;