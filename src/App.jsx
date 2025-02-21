import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from "./components/themeContext";
import { SearchProvider } from "./hooks/SearchContext";
import { UserProvider } from "./hooks/UserContext";
import { useUser } from "./hooks/UserContext";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import LikedCardsPage from "./components/Favorites";
import UserProfile from "./components/MyInfo";
import About from "./components/About";
import Footer from "./components/Footer";
import CardDetails from "./components/CardDetails";
import EditCardForm from "./components/EditCardForm";
import CreateCard from "./components/CreateCard";
import AdminUsersPage from "./components/AdminUsersPage.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import NotFound from "./components/Notfound";
import MyCardsPage from "./components/MyCardsPage";

const AppContent = ({ user, toggleTheme, handleSearch, allCards }) => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && (
        <Navbar
          user={user || { name: "Guest" }}
          toggleTheme={toggleTheme}
          onSearch={handleSearch}
        />
      )}
      <ToastContainer position="top-right" autoClose={1500} />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />

        <Route
          path="/home"
          element={<HomePage user={user || { name: "Guest" }} />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/carddetails/:id" element={<CardDetails />} />
        <Route path="/createcard" element={<CreateCard />} />
        <Route path="/mycards" element={<MyCardsPage />} />
        <Route path="/favorites" element={<LikedCardsPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/editcard/:id" element={<EditCardForm />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!shouldHideNavbar && <Footer />}
    </>
  );
};

function App() {
  const [theme, setTheme] = useState("light");
  const [searchTerm, setSearchTerm] = useState("");
  const [allCards, setAllCards] = useState([]);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const user = null;

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term === "") {
      setCards(allCards.slice(0, 6));
    } else {
      const filteredCards = allCards.filter(
        (card) =>
          card.title.toLowerCase().includes(term.toLowerCase()) ||
          card.description.toLowerCase().includes(term.toLowerCase())
      );
      setCards(filteredCards.slice(0, 6));
    }
  };

  return (
    <Router>
      <UserProvider>
        <ThemeProvider>
          <SearchProvider>
            <AppContent
              user={user}
              toggleTheme={toggleTheme}
              handleSearch={handleSearch}
              allCards={allCards}
            />
          </SearchProvider>
        </ThemeProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
