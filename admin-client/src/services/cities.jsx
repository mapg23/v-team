import API from "../config/api.js";

/**
 * City service for handling all routes regarding cities.
 */
const cityService = {
  /**
   * Get all cities in database
   * @returns {Object} { id: 1, name: "Stockholm" },
      { id: 2, name: "Gothenburg" },
      { id: 3, name: "Malmö" }
   */
  getAllCities: async function getAllCities() {
    return [
      { id: 1, name: "Stockholm" },
      { id: 2, name: "Gothenburg" },
      { id: 3, name: "Malmö" },
    ];
    try {
      const response = await fetch(`${API}/cities`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error on getAllCities! Status: ${response.status}`
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
   * Get City details
   * @param {int} id for the city
   * @return {Object} { "id": 1, "name": "Stockholm", "stations": 5, "bikes": 240 }
   */
  getCityDetails: async function getCityDetails(id) {
    return { id: 1, name: "Stockholm", stations: 5, bikes: 240 };

    try {
      const response = await fetch(`${API}/cities(${id})`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error on getAllCities! Status: ${response.status}`
        );
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
};


export default cityService;