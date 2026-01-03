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
   * Get city details based on city id
   * @param {int} cityId get city with id
   */
  getCityDetailsById: async function getCityDetailsById(id) {
    try {
      const response = await fetch(`${API}/cities/${id}`, {
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

  /**
   * Add new city in database
   * @returns {Object} new city
   */
  addNewCity: async function addNewCity(city) {
    const cityObject = {
      name: `${city}`,
    };
    try {
      const response = await fetch(`${API}/cities`, {
        body: JSON.stringify(cityObject),
        method: "POST",
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

  /**
   * Delete city from database
   * @returns {Object} new city
   */
  deleteCity: async function deleteCity(cityId) {
    try {
      const response = await fetch(`${API}/cities/${cityId}`, {
        // body: JSON.stringify(cityObject),
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return await response.status;
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  /**
   * Get charging stations in city by id
   *
   * @return {Json} array of objects
   */
  getChargingStationsInCity: async function getChargingStationsInCity(cityId) {
    try {
      const response = await fetch(`${API}/cities/${cityId}/stations`, {
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

  /**
   * Get parking zones in city by id
   *
   * @return {Json} array of objects
   */
  getParkingZonesInCity: async function getParkingZonesInCity(cityId) {
    try {
      const response = await fetch(`${API}/cities/${cityId}/parkings`, {
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

  /**
   * Get all bikes in city
   * @param {int} id city id
   * @return {Array} [
      { id: 1, cityId: 1, status: 100, battery: 85, lat: 59.33, lng: 18.07 },
      { id: 2, cityId: 1, status: 400, battery: 60, lat: 59.35, lng: 18.08 },
    ];
   */
  getAllBikesInCity: async function getAllBikesInCity(id) {
    try {
      const response = await fetch(`${API}/cities/${id}/bikes`, {
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

  /**
   * Get all bikes in city
   * @param {int} id city id
   * @return {Array} [
      { id: 1, cityId: 1, status: 100, battery: 85, lat: 59.33, lng: 18.07 },
      { id: 2, cityId: 1, status: 400, battery: 60, lat: 59.35, lng: 18.08 },
    ];
   */
  getSingleBikeInCity: async function getSingleBikeInCity(cityId, bikeId) {
    try {
      const response = await fetch(`${API}/cities/${cityId}/bikes/${bikeId}`, {
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
   * Get all price details for renting a bike in city based on <cityId>
   * @returns {Object} Price details for curreny city
   */
  getPriceDetailsByCityId: async function getPriceDetailsByCityId(cityId) {
    try {
      const response = await fetch(`${API}/prices/${cityId}`, {
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

  /**
   * Update price details in city
   */
  updatePriceDetailsInCity: async function updatePriceDetailsInCity(
    cityId,
    data
  ) {
    
    // Map dataObj to match price sevice in API
    const dataObj = {
      city_id: cityId,
      start_fee: data.startFee,
      minute_fee: data.minuteFee,
      parking_fee: data.parkingFee,
      discount_multiplier: data.discountMultiplier,
    }
    try {
      const response = await fetch(`${API}/prices/${cityId}`, {
        body: JSON.stringify(dataObj),
        method: "PUT",
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

export default cityService;
