import API from "../config/api.js";

const token = sessionStorage.getItem("jwt");

/**
 * Auth Service handling all routes regarding authentication
 * Based on endpoints: https://docs.google.com/spreadsheets/d/1Tza3ZSUOJJRQJeSquKQbE6fRy4d3zNGafAVQxUVNg9M/edit?gid=0#gid=0
 */
const authObject = {
  /**
   * Login user
   * Return status 200 if success
   * @param {string} email
   * @param {string} username
   * @param {string} password
   */
  login: async function login({ email, password, username }) {
    const userObject = {
      email: `${email}`,
      password: `${password}`,
      username: `${username}`
    };

    try {
      const response = await fetch(`${API}/auth/login`, {
        body: JSON.stringify(userObject),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      // if (!response.ok) {
      //   throw new Error(
      //     `HTTP error on Login! Status: ${response.status}`
      //   );
      // }

      return await response.json();
    } catch (error) {
      console.error("Login error:", error);
      return {error: "Invalid credentials"};
    }
  },

  /**
   * Logout user
   * Return status 200 if success
   */
  logout: async function logout() {},
};

export default authObject;
