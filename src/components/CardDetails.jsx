import React from "react";
import { useParams } from "react-router-dom";
import { getCardId } from "../services/cardsService";
import { useEffect, useState } from "react";
import { useUser } from "../hooks/UserContext";

function CardDetails() {
  const { id } = useParams();
  const { user } = useUser();
  console.log("Card ID from URL:", id);

  const [card, setCard] = useState();
  const [err, setError] = useState(null);
  const { VITE_GOOGLE_MAPS_API_KEY: KEY } = import.meta.env;

  useEffect(() => {
    const fetchCard = async () => {
      try {
        console.log(`Fetching card with ID: ${id}`);

        const response = await getCardId(id);

        console.log("Full API Response:", response);
        if (!response) {
          throw new Error("Card not found");
        }

        setCard(response);
      } catch (err) {
        console.error("Error fetching card:", err);
        setError("Failed to load card. Please try again later.");
      }
    };

    fetchCard();
  }, [id]);

  if (err) {
    return <div className="text-danger">{err}</div>;
  }

  if (!card) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container cardDetails">
      {card && (
        <div>
          <h1>{card.title}</h1>
          <img
            className="cardImage m-5 w-25 h-25 img-fluid shadow-lg"
            src={card.image.url}
            alt={card.title}
            onError={(e) => (e.target.src = "default-image.png")}
          />
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
            Address:{" "}
            <p>
              {card.address.city}, {card.address.state},{card.address.country},
              {card.address.houseNumber},{card.address.street}
            </p>
          </h4>
          <h4>
            Business number: <p>{user.bizNumber}</p>
          </h4>
          <div className="map">
            {KEY && (
              <iframe
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                loading="lazy"
                src={`
                    https://www.google.com/maps/embed/v1/place?key=${KEY}
                    &q=${card?.address.street}+${card?.address.city}+${card?.address.state}
                  `}
              />
            )}
          </div>
          <button
            className="btn btn-warning m-5 w-25"
            onClick={() => window.history.back()}
          >
            back
          </button>
        </div>
      )}
    </div>
  );
}

export default CardDetails;
