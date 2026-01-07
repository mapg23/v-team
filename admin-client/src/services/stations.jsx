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
    const token = sessionStorage.getItem("jwt");
    try {
      const response = await fetch(`${API}/stations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
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
    const token = sessionStorage.getItem("jwt");
    try {
      const response = await fetch(`${API}/stations${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
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
   * Get number of bikes currently in charging station <id>
   *
   * @return {Json} array of objects
   */
  getBikesInChargingStation: async function getBikesInChargingStation(
    charingStationId
  ) {
    const token = sessionStorage.getItem("jwt");
    try {
      const response = await fetch(
        `${API}/stations/${charingStationId}/bikes`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },
};

export default stationService;
