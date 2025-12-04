import API from "../config/api.js";

/**
 * Object exporting methods for authentication,
 * such as login/logout
 *
 * Admins cannot be created since it would make no sence
 */
const authObject = {
  /**
   * Login user
   * Return status 200 if success
   * @param {string} username
   * @param {string} password
   */
  login: async function login({ email, password }) {
    const userObject = {
      email: `${email}`,
      password: `${password}`,
    };

    try {
      const response = await fetch(`${API}/login`, {
        body: JSON.stringify(userObject),
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
   * Logout user
   * Return status 200 if success
   */
  logout: async function logout() {},
};

export default authObject;
