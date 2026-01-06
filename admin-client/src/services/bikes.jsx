import API from "../config/api.js";

const token = sessionStorage.getItem("jwt");

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
   * Get bike details
   * @returns {JSON}
   */
  getSingleBike: async function getSingleBike(bikeId) {
    try {
      const response = await fetch(`${API}/bikes/${bikeId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
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
   * Delete bike with ID
   *
   * @returns {JSON}
   */
  deleteBike: async function deleteBike(bikeId) {
    try {
      const response = await fetch(`${API}/bikes/${bikeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      return response;
    } catch (error) {
      console.error("deleteBike fetch error:", error);
      return null;
    }
  },

  /**
   * Delete bike with ID
   * @returns {JSON}
   */
  createNewBike: async function createNewBike(bike) {
    try {
      const bikeObj = {
        ...bike,
      };
      const response = await fetch(`${API}/bikes`, {
        body: JSON.stringify(bikeObj),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error("CreateBike error:", error);
      return null;
    }
  },


  /**
   * Start sync for bikes
   * @returns {JSON}
   */
  startBikeSync: async function startBikeSync() {
    console.log("bike serivce called");
    try {
      const response = await fetch(`${API}/bikes/sync`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error on startBikeSync! Status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("startBikeSync error:", error);
      return [];
    }
  },

  /**
   * Move bike to charging zone
   * @returns {JSON}
   */
  moveBikeToChargingZone: async function moveBikeToChargingZone(
    bikeId,
    zoneId
  ) {
    const moveObject = {
      zoneType: "charging", //
      zoneId: `${zoneId}`,
    };

    try {
      const response = await fetch(`${API}/bikes/${bikeId}/move`, {
        body: JSON.stringify(moveObject),
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error("MoveBikeToChargingZone error:", error);
      return [];
    }
  },

  /**
   * Move bike to parking zone
   * @returns {JSON}
   */
  moveBikeToParkingZone: async function moveBikeToParkingZone(bikeId, zoneId) {
    const moveObject = {
      zoneType: "parking", //
      zoneId: `${zoneId}`,
    };
    try {
      const response = await fetch(`${API}/bikes/${bikeId}/move`, {
        body: JSON.stringify(moveObject),
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error("Move bike to parking zone:", error);
      return [];
    }
  },

  /**
   * Get all bikes currently being used
   * @returns {JSON}
   */
  getAllBikesInUse: async function getAllBikesInUse() {
    try {
      const response = await fetch(`${API}/trips/bikes-in-use`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error("Get All bikes in use:", error);
      return [];
    }
  },
};

export default bikeService;
