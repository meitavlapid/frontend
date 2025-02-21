import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getUserById } from "../services/userServices";

export const getUserFromLocalStorage = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const decodedToken = jwtDecode(token);
    const response = await getUserById(decodedToken.id);
    return { ...response.data, token };
  } catch (error) {
    console.error("Invalid token or user fetch failed:", error);
    return null;
  }
};

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token);

      if (!token) {
        console.warn("🚨 No token found, setting user to null.");
        setUser(null);
        setLoading(false);
        return;
      }

      const decodedToken = jwtDecode(token);
      console.log("Decoded token:", decodedToken);

      const userData = await getUserById(decodedToken.id);
      console.log(`📤 Fetching user from API: /api/users/${decodedToken.id}`);

      console.log("User data fetched:", userData);

      if (userData) {
        setUser({ ...userData, id: decodedToken.id, token });
        console.log("User updated in context:", { ...userData, token });
      } else {
        console.warn("No user data returned from API.");
        setUser(null);
      }
    } catch (error) {
      console.error("Error in fetchUser:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const loginUser = async (token) => {
    try {
      console.log("Token received in loginUser:", token);
      localStorage.setItem("token", token);
      await fetchUser();
    } catch (error) {
      console.error("Error in loginUser:", error);
      setUser(null);
    }
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        setUser,
        loginUser,
        logoutUser,
        fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
