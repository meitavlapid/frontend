import React from "react";
import { useTheme } from "./themeContext";
import { useSearch } from "../hooks/SearchContext";
import { useUser } from "../hooks/UserContext";
import "../css/navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { use } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Offcanvas } from "bootstrap";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { searchTerm, setSearchTerm } = useSearch();
  const { user, isAdmin, isBusiness, logoutUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };
  const closeOffcanvas = () => {
    const offcanvasElement = document.getElementById("offcanvasNavbar");
    const offcanvasInstance = Offcanvas.getInstance(offcanvasElement);
    if (offcanvasInstance) {
      offcanvasInstance.hide();
    }
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const renderNavLinks = () => {
    const links = [
      {
        condition: true,
        label: "About",
        to: "/about",
      },
      {
        condition: user,
        label: "Favorites",
        to: "/favorites",
      },
      {
        condition: user?.isAdmin || user?.isBusiness,
        label: "My Cards",
        to: "/mycards",
      },
      {
        condition: user,
        label: "Profile",
        to: "/profile",
      },
    ];

    return links
      .filter((link) => link.condition)
      .map((link, index) => (
        <li key={index} className="nav-item">
          <Link className="nav-link" to={link.to}>
            {link.label}
          </Link>
        </li>
      ));
  };
  const renderUserIcon = () => {
    if (!user) {
      return (
        <i
          className="fa-solid fa-user fa-2xl"
          title="Guest"
          style={{ marginRight: "10px" }}
        ></i>
      );
    }

    if (user?.isAdmin) {
      return (
        <i
          className="fa-solid fa-user-shield fa-xl text-primary"
          title="Admin"
          style={{ marginRight: "10px" }}
        ></i>
      );
    }

    if (user?.isBusiness) {
      return (
        <i
          className="fa-solid fa-user-tie fa-xl text-info"
          title="Business User"
          style={{ marginRight: "10px" }}
        ></i>
      );
    }

    return (
      <i
        className="fa-solid fa-user fa-xl text-success"
        title="Registered User"
        style={{ marginRight: "10px" }}
      ></i>
    );
  };
  return (
    <nav className="navbar navbar-light bg-light ">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-4" to="/home">
          MLapid
        </Link>

        <div className="d-flex align-items-center">
          <i
            className={`fa-solid ${
              user?.isAdmin
                ? "fa-user-shield text-primary"
                : user?.isBusiness
                ? "fa-user-tie text-info"
                : "fa-user text-success"
            } fa-xl me-2`}
            title={user ? "User" : "Guest"}
          ></i>
          <h5 className="mb-0">{user?.name?.first || "Guest"}</h5>
        </div>

        <i
          className="fa-solid ms-3"
          onClick={toggleTheme}
          style={{ cursor: "pointer" }}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </i>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="offcanvas offcanvas-end custom-offcanvas"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          style={{ width: "250px" }}
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              Menu
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>

          <div className="offcanvas-body">
            <form className="d-flex">
              <input
                className="form-control"
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </form>

            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/about" onClick={closeOffcanvas}>
                  About
                </Link>
              </li>

              {user && (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/profile"
                      onClick={closeOffcanvas}
                    >
                      Profile
                    </Link>
                  </li>
                  {(user?.isAdmin || user?.isBusiness) && (
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/mycards"
                        onClick={closeOffcanvas}
                      >
                        My Cards
                      </Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/favorites"
                      onClick={closeOffcanvas}
                    >
                      Favorites
                    </Link>
                  </li>
                  {user && (user.isAdmin || user.role === "Admin") && (
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/admin/users"
                        onClick={closeOffcanvas}
                      >
                        Admin Panel
                      </Link>
                    </li>
                  )}
                </>
              )}

              {!user ? (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/register"
                      onClick={closeOffcanvas}
                    >
                      Register
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/login"
                      onClick={closeOffcanvas}
                    >
                      Login
                    </Link>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
