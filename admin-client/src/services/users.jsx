import API from "../config/api.js";

/**
 * User service handling all routes regarding users
 * Based on: https://docs.google.com/spreadsheets/d/1Tza3ZSUOJJRQJeSquKQbE6fRy4d3zNGafAVQxUVNg9M/edit?gid=0#gid=0
 */
const userService = {
  /**
   * Get all users
   * @returns {JSON}
   */
  getAllUsers: async function getAllUsers({limit, page}) {
    const token = sessionStorage.getItem("jwt");
    try {
      const response = await fetch(`${API}/users?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error on getAllUsers! Status: ${response.status}`
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
   * Create new User
   * @param {Object} userData - Objekt med keys och values att uppdatera
   * @returns {JSON}
   */
  createNewUser: async function createNewUser(userData) {
    const token = sessionStorage.getItem("jwt");
    const userObject = {
      ...userData,
    };
    try {
      const response = await fetch(`${API}/users`, {
        body: JSON.stringify(userObject),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error on createNewUser! Status: ${response.status}`
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
   * Get user details
   * @returns {JSON}
   */
  getUserDetails: async function getUserDetails(userId) {
    const token = sessionStorage.getItem("jwt");
    try {
      const response = await fetch(`${API}/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error on getUserDetails! Status: ${response.status}`
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
   * Update entire User object
   * @param {number|string} userId - ID för användaren som ska uppdateras
   * @param {Object} userData - Objekt med keys och values att uppdatera
   */
  updateUser: async function updateUser(userId, userData) {
    const token = sessionStorage.getItem("jwt");
    const userObject = {
      ...userData,
    };
    try {
      const response = await fetch(`${API}/users/${userId}`, {
        body: JSON.stringify(userObject),
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error on updateUser! Status: ${response.status}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  /**
   * Patch User (edit part of user)
   * @param {number|string} userId - ID för användaren som ska uppdateras
   * @param {Object} userData - Objekt med keys och values att uppdatera
   */
  patchUser: async function patchUser(userId, userData) {
    const token = sessionStorage.getItem("jwt");
    const userObject = {
      ...userData,
    };
    try {
      const response = await fetch(`${API}/users/${userId}`, {
        body: JSON.stringify(userObject),
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error on patchUser! Status: ${response.status}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  /**
   * Delete User
   * @returns {JSON}
   */
  deleteUser: async function deleteUser(userId) {
    const token = sessionStorage.getItem("jwt");
    try {
      const response = await fetch(`${API}/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error on deleteUser! Status: ${response.status}`);
      }

      // return response
      if (response.status === 204) {
        return true;
      }
      return false

    } catch (error) {
      console.error(error);
      return [];
    }
  },

  /**
   * Get user rental details
   * @returns {JSON}
   */
  getUserRentalDetails: async function getUserRentalDetails(userId) {
    const token = sessionStorage.getItem("jwt");
    try {
      const response = await fetch(`${API}/users/${userId}/rentals`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error on getUserRentalDetails! Status: ${response.status}`
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
   * Get User balance details
   * @returns {JSON}
   */
  getUserBalanceDetails: async function getUserBalanceDetails(userId) {
    const token = sessionStorage.getItem("jwt");
    try {
      const response = await fetch(`${API}/wallets/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error on getUserBalanceDetails! Status: ${response.status}`
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

export default userService;
