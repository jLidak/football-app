import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import FavoriteItems from "../components/FavoriteItems";
import MainView from "../components/MainView";

const BASE_URL = "http://localhost:8080";

const UserView = () => {
  const [favorites, setFavorites] = useState({ leagues: [], teams: [] });
  const [allLeagues, setAllLeagues] = useState([]);
  const [sortedLeagues, setSortedLeagues] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    // Fetch all favorites
    axios
      .get(`${BASE_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setFavorites(response.data))
      .catch((error) => console.error("Error fetching favorites:", error));

    // Fetch all leagues
    axios
      .get(`${BASE_URL}/api/leagues`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAllLeagues(response.data);
        sortLeagues(response.data, favorites.leagues);
      })
      .catch((error) => console.error("Error fetching leagues:", error));
  }, [token]);

  useEffect(() => {
    // Sort leagues whenever allLeagues or favorites.leagues changes
    sortLeagues(allLeagues, favorites.leagues);
  }, [allLeagues, favorites.leagues]);

  const sortLeagues = (leagues, favoriteLeagues) => {
    const favoriteIds = favoriteLeagues.map((fav) => fav.league.id);
    const sorted = leagues.sort((a, b) => {
      const aIsFavorite = favoriteIds.includes(a.id);
      const bIsFavorite = favoriteIds.includes(b.id);
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
      return a.name.localeCompare(b.name);
    });
    setSortedLeagues(sorted);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const toggleFavoriteLeague = (league) => {
    const isFavorite = favorites.leagues.some(
      (fav) => fav.league.id === league.id,
    );
    const endpoint = isFavorite
      ? `${BASE_URL}/api/favorite-leagues/remove`
      : `${BASE_URL}/api/favorite-leagues/add`;

    axios
      .post(
        endpoint,
        { leagueId: league.id },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then(() => {
        // Refetch favorites after updating
        axios
          .get(`${BASE_URL}/api/favorites`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => setFavorites(response.data))
          .catch((error) =>
            console.error("Error refreshing favorites:", error),
          );
      })
      .catch((error) =>
        console.error("Error toggling favorite league:", error),
      );
  };

  const formattedDate = `${selectedDate.getDate().toString().padStart(2, "0")}/${(
    selectedDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}`;

  return (
    // <MainView/>
    <FavoriteItems />
  );
};

export default UserView;
