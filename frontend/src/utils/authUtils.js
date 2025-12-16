import Cookies from "js-cookie";

const TOKEN_KEY = "authToken";
const USERNAME_KEY = "username";

export const authUtils = {
  /**
   * Store the token and username.
   * @param {string} token - JWT token
   * @param {string} username - Username
   * @param {boolean} rememberMe - Use cookie for persistent login
   */
  setAuth(token, username, rememberMe = false) {
  if (rememberMe) {
    const options = { expires: 30, sameSite: "strict" };
    Cookies.set(TOKEN_KEY, token, options);
    if (username) Cookies.set(USERNAME_KEY, username, options);

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  } else {
    // Only use sessionStorage
    sessionStorage.setItem("token", token);
    if (username) sessionStorage.setItem("username", username);

    // Remove cookies and localStorage to avoid persistence
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USERNAME_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
  }
},

  /** Get the JWT token from storage */
  getToken() {
    return (
      localStorage.getItem(TOKEN_KEY) ||
      Cookies.get(TOKEN_KEY) ||
      sessionStorage.getItem("token")
    );
  },

  /** Get the username from storage */
  getUsername() {
    return (
      localStorage.getItem(USERNAME_KEY) ||
      Cookies.get(USERNAME_KEY) ||
      sessionStorage.getItem("username") ||
      "Guest"
    );
  },

  /** Check if user is authenticated */
  isAuthenticated() {
    return !!this.getToken();
  },

  /** Clear all auth data */
  clearAuth() {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USERNAME_KEY);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
  },
};
