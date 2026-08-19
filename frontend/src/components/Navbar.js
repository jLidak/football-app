import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DeleteAccountButton from "./DeleteAccountButton";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import axios from "axios";

const BASE_URL = "http://localhost:8080";

const Navbar = ({
  isLoggedIn,
  setIsLoggedIn,
  loginData,
  onLogout,
  onOpenLogin,
  onOpenRegistration,
  onOpenPasswordReset,
  onModeSwitch,
  currentMode,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const toggleMenu = () => setIsMenuActive((prevState) => !prevState);

  const handleSearch = async (query) => {
    if (query.length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/search`, {
        params: { query },
      });
      setSearchResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleResultClick = (path) => {
    setShowResults(false);
    navigate(path);
  };

  const renderSearchResults = () => (
    <div className="search-results">
      {searchResults.teams && searchResults.teams.length > 0 && (
        <div className="search-category">
          <h6 className="search-category-title">Teams</h6>
          {searchResults.teams.map((team) => (
            <div
              key={team.id}
              className="search-result-item"
              onClick={() => handleResultClick(`/team/${team.id}`)}
            >
              {team.name}
            </div>
          ))}
        </div>
      )}
      {searchResults.players && searchResults.players.length > 0 && (
        <div className="search-category">
          <h6 className="search-category-title">Players</h6>
          {searchResults.players.map((player) => (
            <div
              key={player.id}
              className="search-result-item"
              onClick={() => handleResultClick(`/player/${player.id}`)}
            >
              {player.firstName} {player.lastName}
            </div>
          ))}
        </div>
      )}
      {searchResults.coaches && searchResults.coaches.length > 0 && (
        <div className="search-category">
          <h6 className="search-category-title">Coaches</h6>
          {searchResults.coaches.map((coach) => (
            <div
              key={coach.id}
              className="search-result-item"
              onClick={() => handleResultClick(`/coach/${coach.id}`)}
            >
              {coach.firstName} {coach.lastName}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <nav className="navbar">
      <div className="container-fluid">
        <Link to="/" className="navbar-logo">
          <img src="/assets/logo.png" alt="Logo" />
        </Link>
        <div className="navbar-search">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Szukaj..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            onFocus={() => searchQuery.length >= 3 && setShowResults(true)}
          />
          {showResults && renderSearchResults()}
        </div>
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <div className={`navbar-menu ${isMenuActive ? "active" : ""}`}>
          <Link
            to="/transfers"
            className="btn btn-outline-primary navbar-btn me-1"
          >
            Transfers
          </Link>
          {isLoggedIn && (
            <Link to="/add-bet" className="btn btn-light navbar-btn">
              Bets
            </Link>
          )}
          {isLoggedIn &&
            (loginData.role === "ROLE_ADMIN" ||
              loginData.role === "ROLE_MODERATOR") && (
              <>
                <span className="role">
                  Role:{" "}
                  {loginData.role === "ROLE_ADMIN" ? "ADMIN" : "MODERATOR"}
                </span>
                <button
                  onClick={onModeSwitch}
                  className="btn btn-outline-secondary btn-switchMode navbar-btn"
                >
                  {currentMode === "user"
                    ? `Switch to ${loginData.role === "ROLE_ADMIN" ? "ADMIN" : "MOD"} View`
                    : "Switch to USER View"}
                </button>
              </>
            )}
          {isLoggedIn ? (
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle
                caret
                className="btn btn-dark navbar-btn btn-email"
              >
                {loginData.email}
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem
                  onClick={onOpenPasswordReset}
                  className="passwordButton"
                >
                  Change Password
                </DropdownItem>
                <DropdownItem divider />
                <DeleteAccountButton setIsLoggedIn={setIsLoggedIn} />
                <DropdownItem divider />
                <DropdownItem
                  onClick={() => navigate("/notifications")}
                  className="notificationsButton"
                >
                  Notifications
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={onLogout} className="logoutButton">
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <>
              <button
                onClick={onOpenLogin}
                className="btn btn-primary navbar-btn btn-login"
              >
                Login
              </button>
              <button
                onClick={onOpenRegistration}
                className="btn btn-dark navbar-btn btn-register"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
