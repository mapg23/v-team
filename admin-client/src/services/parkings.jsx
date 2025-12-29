import API from "../config/api.js";
/**
 * Parking services handling all routes regarding parkings
 * Based on endpoints: https://docs.google.com/spreadsheets/d/1Tza3ZSUOJJRQJeSquKQbE6fRy4d3zNGafAVQxUVNg9M/edit?gid=0#gid=0
 */
const parkingService = {
  /**
   * Get all parking zones
   * @return {JSON} array of objects
   */
  // getAllParkingZones: async function getAllParkingZones() {
  //   try {
  //     const response = await fetch(`${API}/parkings`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     return await response.json();
  //   } catch (error) {
  //     console.error(error);
  //     return [];
  //   }
  // },

  /**
   * Add a new parking zone
   * @return {JSON} array of objects
   */
  addNewParkingZone: async function addNewParkingZone(cityId) {
    const parkObj = {
      city_id: `${cityId}`,
    };
    try {
      const response = await fetch(`${API}/parkings`, {
        body: JSON.stringify(parkObj),
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

  // /**
  //  * Get parking zone details
  //  * @return {JSON} array of objects
  //  */
  // getParkingZoneDetails: async function getAllParkingZones(parkId) {
  //   try {
  //     const response = await fetch(`${API}/parkings/${parkId}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     return await response.json();
  //   } catch (error) {
  //     console.error(error);
  //     return [];
  //   }
  // },

  /**
   * Update parking zone details
   * @return {JSON} array of objects
   */
  updateParkingZone: async function updateParkingZone(parkId) {
    try {
      const response = await fetch(`${API}/parkings/${parkId}`, {
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

  /**
   * Delete parking zone
   * @return {JSON} array of objects
   */
  deleteParkingZone: async function deleteParkingZone(parkId) {
    try {
      const response = await fetch(`${API}/parkings/${parkId}`, {
        method: "DELETE",
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
   * Get all parking zones
   * @return {JSON} array of objects
   */
  getAllBikesInParkingZone: async function getAllBikesInParkingZone(parkingId) {
    try {
      const response = await fetch(`${API}/parkings/${parkingId}/bikes`, {
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

export default parkingService;