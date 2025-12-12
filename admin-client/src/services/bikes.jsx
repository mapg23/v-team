import API from "../config/api.js";

/**
 * Bike services handling all routes regarding bikes
 * based on endpoints: https://docs.google.com/spreadsheets/d/1Tza3ZSUOJJRQJeSquKQbE6fRy4d3zNGafAVQxUVNg9M/edit?gid=0#gid=0
 */
const bikeService = {
  /**
   * Get All bikes
   * @returns {JSON}
   */
  getAllBikes: async function getAllBikes() {
    try {
      const response = await fetch(`${API}/bikes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error on fetchDocuments! Status: ${response.status}`
        );
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("fetchDocuments error:", error);
      return [];
    }
  },

  /**
   * Get bike details
   * @returns {JSON}
   */
  getSingleBike: async function getSingleBike(bikeId) {
    try {
      const response = await fetch(`${API}/bikes/${bikeId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error on fetchDocuments! Status: ${response.status}`
        );
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("fetchDocuments error:", error);
      return [];
    }
  },

  /**
   * Get bikes renetal details
   * @returns {JSON}
   */
  getRentedBikeDetails: async function getRentedBikeDetails(bikeId) {
    try {
      const response = await fetch(`${API}/bikes/${bikeId}/rental`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error on fetchDocuments! Status: ${response.status}`
        );
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("fetchDocuments error:", error);
      return [];
    }
  },

  /**
   * Get bikes renetal details
   * @returns {JSON}
   */
  endBikeRental: async function endBikeRental(bikeId) {
    try {
      const response = await fetch(`${API}/bikes/${bikeId}/rental/end`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error on fetchDocuments! Status: ${response.status}`
        );
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("fetchDocuments error:", error);
      return [];
    }
  },

  /**
   * Start sync for bikes
   * @returns {JSON}
   */
  startBikeSync: async function startBikeSync() {
    console.log("bike serivce called")
    try {
      const response = await fetch(`${API}/bikes/sync`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error on startBikeSync! Status: ${response.status}`
        );
      }

      return await response.json();
      
    } catch (error) {
      console.error("fetchDocuments error:", error);
      return [];
    }
  },
};

export default bikeService;
