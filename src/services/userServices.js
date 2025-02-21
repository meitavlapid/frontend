import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
export async function loginUser(credentials) {
  try {
    const response = await axios.post(`${API_URL}/users/login`, credentials, {
      headers: { "Content-Type": "application/json" },
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error.message);
    throw error;
  }
}

export async function registerUser(userData) {
  try {
    const response = await axios.post("${API_URL}/users/register", userData);

    console.log("🚀 Server Response:", response); // ✅ הדפסת התגובה

    return response.data; // ✅ מחזיר את המידע הרצוי
  } catch (error) {
    console.error(
      "❌ Error registering user:",
      error.response?.data || error.message
    );
    throw error;
  }
}
// 🔹 קבלת כל המשתמשים (Admin בלבד)
export async function getAllUsers() {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication token is missing");

    const response = await axios.get(`${API_URL}`, {
      headers: { "x-auth-token": token, "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching users:",
      error.response?.data || error.message
    );
    throw error;
  }
}

//get s specific user by id
export async function getUserById(userId) {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication token is missing");

    if (!userId) {
      console.error("🔴 userId is undefined! Cannot fetch user.");
      return null;
    }

    const response = await axios.get(`${API_URL}/users/${userId}`, {
      headers: { "x-auth-token": token, "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user:",
      error.response?.data || error.message
    );
    return null;
  }
}

//update a specific user
export async function updateUser(userId, updatedData) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.put(
      `${API_URL}/users/${userId}`, // ✅ הוספת `/users`
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}
export async function deleteUser(id) {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication token is missing");

    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { "x-auth-token": token, "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error deleting user:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// 🔹 נעילת משתמש (Admin בלבד)
export async function lockUser(id) {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication token is missing");

    const response = await axios.put(
      `${API_URL}/${id}/lock`,
      {},
      {
        headers: { "x-auth-token": token, "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error locking/unlocking user:",
      error.response?.data || error.message
    );
    throw error;
  }
}
export async function updateBizNumber(userId, newBizNumber) {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication token is missing");

    const response = await axios.put(
      `${API_URL}/users/${userId}/bizNumber`,
      {
        bizNumber: newBizNumber,
      },
      {
        headers: { "x-auth-token": token, "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error updating business number:",
      error.response?.data || error.message
    );
    throw error;
  }
}
