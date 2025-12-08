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
  getAllUsers: async function getAllUsers() {
    try {
      const response = await fetch(`${API}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
   * Delete all users
   * @returns {JSON}
   */
  deleteAllUsers: async function deleteAllUsers() {
    try {
      const response = await fetch(`${API}/users`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
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
    const userObject = {
      ...userData,
    };
    try {
      const response = await fetch(`${API}/users`, {
        body: JSON.stringify(userObject),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
    try {
      const response = await fetch(`${API}/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
    const userObject = {
      ...userData,
    };
    try {
      const response = await fetch(`${API}/users/${userId}`, {
        body: JSON.stringify(userObject),
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
    const userObject = {
      ...userData,
    };
    try {
      const response = await fetch(`${API}/users/${userId}`, {
        body: JSON.stringify(userObject),
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
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
    try {
      const response = await fetch(`${API}/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
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
   * Get user rental details
   * @returns {JSON}
   */
  getUserRentalDetails: async function getUserRentalDetails(userId) {
    return [{
      id: 1
    }]
    try {
      const response = await fetch(`${API}/users/${userId}/rentals`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
   * Edit user rental
   * @param {number|string} userId - ID för användaren som ska uppdateras
   * @param {Object} userData - Objekt med keys och values att uppdatera
   * @returns {JSON}
   */
  editUserRental: async function editUserRental(userId, userData) {
    const userObject = {
      ...userData,
    };
    try {
      const response = await fetch(`${API}/users/${userId}/rentals`, {
        body: JSON.stringify(userObject),
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error on editUserRental! Status: ${response.status}`
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
   * Patch user rental
   * @param {number|string} userId - ID för användaren som ska uppdateras
   * @param {Object} userData - Objekt med keys och values att uppdatera
   * @returns {JSON}
   */
  patchUserRental: async function patchUserRental(userId, userData) {
    const userObject = {
      ...userData,
    };
    try {
      const response = await fetch(`${API}/users/${userId}/rentals`, {
        body: JSON.stringify(userObject),
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
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
   * Get user rental details
   * @returns {JSON}
   */
  deleteUserRental: async function deleteUserRental(userId) {
    try {
      const response = await fetch(`${API}/users/${userId}/rentals`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error on deleteUserRental! Status: ${response.status}`
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
    return {
      balance: 100
    }
    try {
      const response = await fetch(`${API}/users/${userId}/balance`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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

  /**
   * Edit User balance
   * @param {number|string} userId - ID för användaren som ska uppdateras
   * @param {Object} balance - Objekt med keys och values att uppdatera
   * @returns {JSON}
   */
  editUserBalance: async function editUserBalance(userId, balance) {
    const balanceObject = {
      ...balance,
    };

    try {
      const response = await fetch(`${API}/users/${userId}/balance`, {
        body: JSON.stringify(balanceObject),
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
