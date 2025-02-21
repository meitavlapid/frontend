import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getAllUsers() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ No token found");
      throw new Error("Unauthorized: No token");
    }

    const response = await axios.get("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("📢 API Response:", response); // בדוק את הנתונים מהשרת
    console.log("📢 API Data:", response.data);

    if (!response.data) {
      console.error("❌ No data received from server");
      throw new Error("No users found");
    }

    return response;
  } catch (error) {
    console.error(
      "🚨 Error fetching users:",
      error.response?.data || error.message
    );
    throw error;
  }
}
export const deleteUser = (userId) =>
  axios.delete(`${API_URL}/admin/users/${userId}`);





export const toggleLockUser = async (userId, lockStatus) => {
  try {
    console.log(`Toggling lock for user ${userId} to ${lockStatus}`);
    const response = await axios.put(
      `${API_URL}/admin/users/${userId}/lock`,
      { isLocked: lockStatus },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // אם נדרש טוקן
        },
      }
    );
    console.log("Server response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error toggling lock:",
      error.response?.data || error.message
    );
    throw error;
  }
};
