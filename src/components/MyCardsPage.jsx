import React, { useEffect, useState } from "react";
import { data, useNavigate, useParams } from "react-router-dom";
import { getAllMyCards, deleteCard } from "../services/cardsService";
import { toast } from "react-toastify";
import "../css/myCardsPage.css";
import { useUser } from "../hooks/UserContext";

function MyCardsPage() {
  const { user } = useUser();
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCards = async () => {
      if (!user || !user.id) {
        console.error("🚨 Error: No user found, skipping fetch.");
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
        }
        console.log("📤 Fetching cards for user:", user.id);
        const allCards = await getAllMyCards(user._id);
        setCards(allCards);
        console.log("Cards:", cards);
      } catch (error) {
        console.error("Error fetching my cards:", error);
        setError("Failed to fetch cards. Please try again later.");
        if (error.message.includes("not logged in")) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
        let isrun = false;
        if (!isrun) {
          toast.success("Cards loaded successfully!", { toastId: "uniqueId" });
          isrun = true;
        }
      }
    };

    fetchCards();
  }, [user]);

  return (
    <div className="mycontainer">
      <h1>My Cards Page</h1>

      <button
        className="mycardbuttoncreate "
        onClick={() => {
          navigate("/createcard");
        }}
      >
        Create Card
      </button>

      {cards.length > 0 && (
        <div className="mycardspage">
          {cards.map((card) => (
            <div key={card.id}>
              <div className="mycard">
                <img
                  className="mycard"
                  src={card.image.url}
                  alt={card.title}
                  onError={(e) => (e.target.src = "default-image.png")}
                />{" "}
                <h1>{card.title}</h1>
                <h4>{card.subtitle}</h4>
                <p>{card.description}</p>
                <h4>
                  Phone:<p> {card.phone}</p>
                </h4>
                <h4>
                  Email: <p> {card.email}</p>
                </h4>
                <h4>
                  Web:<p> {card.web}</p>
                </h4>
                <h4>
                  Address:
                  <p>
                    {card.address.city}, {card.address.state},
                    {card.address.country},{card.address.houseNumber},
                    {card.address.street}
                  </p>
                </h4>
                <h4>
                  biz number: <p>{user.bizNumber}</p>
                </h4>
                <i
                  className="fa-solid fa-heart"
                  style={{
                    color: "red",
                    fontSize: "0.9rem",
                  }}
                ></i>
                {card.likes.length}
                <div className="mycardbuttons">
                  <button
                    className="mycardbuttonedit"
                    onClick={() => {
                      navigate(`/editcard/${card._id}`);
                    }}
                  >
                    <i
                      className="fa-regular fa-pen-to-square"
                      style={{ backgroundColor: "transparent" }}
                    ></i>
                  </button>
                  <button
                    className="mycardbuttondelete"
                    onClick={() => {
                      deleteCard(card.id);
                      toast.success("Card deleted successfully!", {
                        toastId: "uniqueId",
                      });

                      setCards((prevCards) =>
                        prevCards.filter((c) => c.id !== card._id)
                      );
                    }}
                  >
                    <i
                      className="fa-solid fa-trash-can"
                      style={{ backgroundColor: "transparent" }}
                    ></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCardsPage;
