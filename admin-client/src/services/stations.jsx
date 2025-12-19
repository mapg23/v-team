import API from "../config/api.js";

/**
 * Station services handling all routes regarding stations
 * Based on endpoints: https://docs.google.com/spreadsheets/d/1Tza3ZSUOJJRQJeSquKQbE6fRy4d3zNGafAVQxUVNg9M/edit?gid=0#gid=0
 */
const stationService = {
  /**
   * Get all stations
   */
  getAllStations: async function getAllStations() {
    try {
      const response = await fetch(`${API}/stations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error on getAllStations! Status: ${response.status}`
        );
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  /**
   * Get details for this station
   * @returns {Object} Json object
   */
  getStationDetails: async function getStationDetails(id) {
    try {
      const response = await fetch(`${API}/stations${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error on getStationDetails! Status: ${response.status}`
        );
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  /**
   * Get stations in city by id
   *
   * @return {Json} array of objects
   */
  getBikesInStation: async function getBikesInStation(stationId) {
    try {
      const response = await fetch(`${API}/stations/${stationId}/bikes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },
};

export default stationService;
