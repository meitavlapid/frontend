import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllCards, likeCard } from "../services/cardsService";
import { FaPhone } from "react-icons/fa";
import { useTheme } from "./themeContext";
import { useSearch } from "../hooks/SearchContext";
import { getUserById } from "../services/userServices";
import { toast } from "react-toastify";
import { useUser } from "../hooks/UserContext";
import { use } from "react";

function HomePage() {
  const [allCards, setAllCards] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [likedCards, setLikedCards] = useState({});
  const { searchTerm } = useSearch();
  const { user, loading: userLoading } = useUser();

  const navigate = useNavigate();

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const fetchCards = async () => {
    if (userLoading) {
      console.log("Skipping fetchCards, user not ready.");
      return;
    }

    setLoading(true);

    try {
      console.log("Fetching cards...");
      const response = await getAllCards();
      const fetchedCards = response.data || [];
      console.log("Fetched cards:", fetchedCards);

      setAllCards(fetchedCards);

      setCards(fetchedCards.slice(0, 6));
      if (user && user._id) {
        const likesState = fetchedCards.reduce((acc, card) => {
          acc[card._id] = (card.likes || []).includes(user.id);
          return acc;
        }, {});
        setLikedCards(likesState);
        console.log("Likes state updated:", likesState);
      } else {
        setLikedCards({});
      }
    } catch (err) {
      console.error("Error fetching cards:", err);
      setError("Failed to load cards.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("User loading:", userLoading);
    console.log("Current user:", user);

    if (userLoading === true) {
      console.log("Skipping fetchCards, user not ready.");
      return;
    }

    fetchCards();
  }, [user, userLoading]);

  useEffect(() => {
    const filteredCards = allCards.filter((card) =>
      card.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCards(filteredCards.slice(0, 6));
  }, [searchTerm, allCards]);

  const loadMoreCards = () => {
    const nextCards = allCards
      .filter((card) =>
        card.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(cards.length, cards.length + 6);
    setCards((prevCards) => [...prevCards, ...nextCards]);
  };

  const handleLike = async (cardId) => {
    if (!cardId) {
      console.error("🚨 Error: cardId is undefined!");
      return;
    }

    try {
      console.log("👍 Sending like request for card:", cardId);

      await likeCard(cardId); // שליחת בקשת הלייק ל-API

      setLikedCards((prevLikedCards) => ({
        ...prevLikedCards,
        [cardId]: !prevLikedCards[cardId], // הפיכת מצב הלייק
      }));

      toast.success("Like status updated!");
    } catch (error) {
      console.error("🚨 Error updating like status:", error);
      toast.error("Failed to update like status.");
    }
  };

  if (userLoading) {
    return <div>Loading user data...</div>;
  }
  return (
    <div className="home-container ">
      <header className="text-center ">
        <h1>Welcome</h1>
        <h2>Discover the Best Recommended Businesses!</h2>
      </header>
      {loading ? (
        <div className="spinner-border text-info" role="status"></div>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <section className="cards-section">
          {cards.map((card) => (
            <div key={card.id} className="card">
              <img src={card.image.url} alt={card.title} />
              <h3>{card.title}</h3>
              <h4>{card.subtitle}</h4>
              <p>{card.description}</p>
              <div className="details">
                <h4>Phone: {card.phone}</h4>
                <h4>
                  Address: {`${card.address.street}, ${card.address.city}`}
                </h4>
              </div>
              <div className="actions">
                <button
                  className="phone-icon"
                  onClick={() => handleCall(card.phone)}
                >
                  <FaPhone style={{ backgroundColor: "inherit" }} />
                </button>
                {user && (
                  <button
                    className="like-button"
                    onClick={() => handleLike(card._id)}
                    disabled={!user}
                  >
                    <i
                      className="fa-solid fa-heart"
                      style={{
                        color: likedCards[card._id] ? "red" : "gray",
                        fontSize: "0.9rem",
                        backgroundColor: "transparent",
                      }}
                    ></i>
                  </button>
                )}

                <button
                  className="view-button"
                  onClick={() => {
                    if (!user) {
                      navigate("/login");
                    } else {
                      console.log(
                        "Navigating to card details with ID:",
                        card.id
                      ); // הוסף את זה

                      navigate(`/carddetails/${card._id}`);
                    }
                  }}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {!loading && cards.length < allCards.length && (
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={loadMoreCards}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
