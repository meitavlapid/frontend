import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
//get all card
export function getAllCards() {
  return axios.get(`${API_URL}/cards`);
}
//get s specific card by id
export async function getCardId(cardId) {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const response = await axios.get(`${API_URL}/cards/${cardId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data) {
      throw new Error("Card data not found");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching card:", error);
    return null; // מחזיר null במקום undefined
  }
}
export async function getAllMyCards() {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("🚨 No authentication token found");
    }

    console.log(`📢 Fetching my cards with token: ${token}`);

    const response = await axios.get(`${API_URL}/cards/my-cards`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("📥 Response from server:", response.data);
    return response.data;
  } catch (error) {
    console.error("🚨 Error fetching user cards:", error);
    throw error;
  }
}

//add new card
export async function addCard(cardData) {
  try {
    const token = localStorage.getItem("token");
    console.log("🟢 Sending token:", token);

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.post(`${API_URL}/cards`, cardData, {
      headers: {
        "x-auth-token": token,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Card added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "🚨 Error adding card:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function updateCard(id, cardData) {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication token is missing");

    const response = await axios.put(`${API_URL}/cards/${id}`, cardData, {
      headers: { "x-auth-token": token, "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error updating card:",
      error.response?.data || error.message
    );
    throw error;
  }
}

//delete a specific card

export async function deleteCard(id) {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication token is missing");

    const response = await axios.delete(`${API_URL}/cards/${id}`, {
      headers: { "x-auth-token": token, "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error deleting card:",
      error.response?.data || error.message
    );
  }
}
//like/unlike a specific card

export async function likeCard(cardId) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  try {
    const response = await axios.patch(
      `${API_URL}/cards/${cardId}/like`, // 🛠️ תיקון הנתיב
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("🚨 Error liking the card:", error);
    throw error;
  }
}
