import React, { useEffect, useState } from "react";
import { getAllCards } from "../services/cardsService";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserContext, {
  getUserFromLocalStorage,
  useUser,
} from "../hooks/UserContext";
import "../css/favorites.css";

function LikedCardsPage() {
  const [likedCards, setLikedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const value = useUser();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndLikedCards = async () => {
      try {
        if (!user) {
          const userData = await value.user;
          setUser(userData);
          console.log("User loaded:", userData);
        }

        if (user) {
          const allCards = (await getAllCards()).data;
          console.log("All cards:", allCards);

          const userLikedCards = allCards.filter((card) =>
            card.likes.includes(user.id)
          );
          console.log("User liked cards:", userLikedCards);

          setLikedCards(userLikedCards);
        }
      } catch (err) {
        console.error("Error fetching liked cards:", err);
        setError("Failed to fetch liked cards. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndLikedCards();
  }, [user, value.user]);
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="favhome-container">
      <h1 className="liked-cards">My Favorites Cards</h1>
      {likedCards.length > 0 ? (
        <div className="favcards-section">
          {likedCards.map((card) => (
            <div key={card.id}>
              <div className="favcard">
                <img
                  className="favcard"
                  src={card.image.url}
                  alt={card.image.alt || card.title}
                  onError={(e) => (e.target.src = "default-image.png")}
                />
                <div className="favdetails">
                  <h3 className="favcard-title">{card.title}</h3>
                  <h4 className="favcard-text">{card.subtitle}</h4>
                  <p className="card-text">{card.description}</p>
                  <div className="favcard-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/carddetails/${card._id}`)}
                    >
                      View
                    </button>
                    <i
                      className="fa-solid fa-heart"
                      style={{
                        color: "red",
                        fontSize: "0.9rem",
                        backgroundColor: "transparent",
                      }}
                    ></i>
                    {card.likes.length}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No liked cards found.</div>
      )}
    </div>
  );
}

export default LikedCardsPage;
