import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, ListGroup } from "react-bootstrap";
import TeamImageVerySmall from "./TeamImageVerySmall";
import { Link, useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8080";

const Sidebar = ({ onOpenRegistration }) => {
  const token = localStorage.getItem("jwtToken");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (token) {
      axios
        .get(`${BASE_URL}/api/auth/get-email`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const userEmail = response.data;
          return axios.get(`${BASE_URL}/api/auth/users/email/${userEmail}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        })
        .then((response) => setUserId(response.data.id))
        .catch((error) => console.error("Error fetching user ID:", error));
    }
  }, [token]);

  const [allLeagues, setAllLeagues] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState({
    leagues: [],
    teams: [],
  });
  const [isFavoritesReady, setIsFavoritesReady] = useState(false); // Flaga określająca gotowość
  useEffect(() => {
    console.log("Favorites state updated:", favorites);
  }, [favorites]);
  useEffect(() => {
    if (userId) {
      axios
        .get(`${BASE_URL}/api/favorites/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log(`Favorites fetched for ${userId}:`, response.data);
          setFavorites(response.data); // Ustawienie favorites
          setIsFavoritesReady(true); // Oznaczenie, że dane są gotowe
        })
        .catch((error) => {
          console.error("Error fetching favorites:", error);
          setIsFavoritesReady(true); // Nawet w przypadku błędu ustaw flagę
        });
    }
  }, [userId, token]);

  const getDistinctLeagues = (leagues) => {
    const leagueMap = new Map();

    leagues.forEach((league) => {
      const editionYears = league.edition.split("/").map(Number); // Rozdziela edycję na lata
      const editionYear = Math.max(...editionYears); // Pobiera większy rok, np. z "2023/2024" -> 2024

      if (
        !leagueMap.has(league.name) ||
        editionYear > leagueMap.get(league.name).year
      ) {
        leagueMap.set(league.name, { ...league, year: editionYear });
      }
    });

    return Array.from(leagueMap.values());
  };

  const updateFavorites = (newFavorites) => {
    setFavorites(newFavorites);
    console.log("Nowe wartości favorites:", newFavorites);
  };

  const toggleFavorite = async (type, item) => {
    if (!userId) {
      if (onOpenRegistration) {
        onOpenRegistration(); // Otwórz modal rejestracji, jeśli użytkownik nie jest zalogowany
      }
      return;
    }
    console.log("Toggling favorite:", type, item);

    if (!userId || !item || !item.id) {
      console.error("Invalid userId or item.");
      return;
    }

    // Mapa typów dla liczby pojedynczej
    const typeMap = {
      teams: "team",
      leagues: "league",
      matches: "match",
    };

    const singularType = typeMap[type]; // Pobranie liczby pojedynczej z mapy

    if (!singularType) {
      console.error("Invalid type provided:", type);
      return;
    }

    // Sprawdzenie, czy element jest ulubiony, za pomocą uniwersalnego isFavorite
    const isFavoriteItem = isFavorite(type, item.id);

    const endpointMap = {
      team: isFavoriteItem
        ? `${BASE_URL}/api/favorite-teams/remove`
        : `${BASE_URL}/api/favorite-teams/add`,
      league: isFavoriteItem
        ? `${BASE_URL}/api/favorite-leagues/remove`
        : `${BASE_URL}/api/favorite-leagues/add`,
      match: isFavoriteItem
        ? `${BASE_URL}/api/favorite-matches/remove`
        : `${BASE_URL}/api/favorite-matches/add`,
    };

    const dataMap = {
      team: { teamId: item.id, userId },
      league: { leagueId: item.id, userId },
      match: { matchId: item.id, userId },
    };

    const endpoint = endpointMap[singularType];
    const data = dataMap[singularType];

    if (!endpoint || !data) {
      console.error("Invalid endpoint or data for type:", singularType);
      return;
    }

    console.log("Endpoint:", endpoint);
    console.log("Data:", data);

    try {
      if (isFavoriteItem) {
        // Usunięcie z ulubionych
        await axios({
          method: "delete",
          url: endpoint,
          headers: { Authorization: `Bearer ${token}` },
          data: data, // Przekazanie danych dla DELETE
        });
      } else {
        // Dodanie do ulubionych
        await axios.post(endpoint, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // Odświeżanie ulubionych po każdej operacji
      await refetchFavorites();
    } catch (error) {
      console.error(`Error toggling favorite ${type}:`, error);
    }
  };

  const refetchFavorites = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/favorites/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(response.data); // Zaktualizowanie ulubionych
      console.log("Favorites refreshed:", response.data);
    } catch (error) {
      console.error("Error fetching updated favorites:", error);
    }
  };
  const isFavorite = (type, id) => {
    const typeMap = {
      matches: (fav) => fav.match.id === id,
      leagues: (fav) => fav.league.id === id,
      teams: (fav) => fav.team.id === id,
    };

    if (!typeMap[type]) {
      console.error(`Invalid type provided: ${type}`);
      return false;
    }

    return favorites[type]?.some(typeMap[type]) || false;
  };

  useEffect(() => {
    // Pobierz wszystkie ligi i drużyny
    axios
      .get(`${BASE_URL}/api/leagues`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const distinctLeagues = getDistinctLeagues(response.data);
        setAllLeagues(distinctLeagues);
      })
      .catch((error) => console.error("Error fetching leagues:", error));

    axios
      .get(`${BASE_URL}/api/teams`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setAllTeams(response.data))
      .catch((error) => console.error("Error fetching teams:", error));
  }, [token]);

  const handleLeagueClick = (leagueId) => {
    navigate(`/league/${leagueId}`);
  };

  return (
    <>
      <h5 className="mt-4">Favorite leagues</h5>
      <ListGroup>
        {!token && <p>You must be logged in to use this feature.</p>}
        {token && isFavoritesReady && favorites.leagues.length === 0 && (
          <ListGroup.Item>You do not have any favorite leagues.</ListGroup.Item>
        )}
        {favorites.leagues.map((league) => (
          <ListGroup.Item
            key={league.league.id}
            className="d-flex align-items-center justify-content-between"
          >
            <div className="d-flex align-items-center">
              <img
                src={`/assets/flags/${league.league.country.code}.svg`}
                alt={league.league.country.name}
                style={{
                  width: "20px",
                  height: "15px",
                  marginRight: "10px",
                  borderRadius: "2px",
                  boxShadow: "0 0 2px rgba(0, 0, 0, 0.2)",
                }}
              />
              <span
                onClick={() => handleLeagueClick(league.league.id)}
                style={{ cursor: "pointer" }}
              >
                {league.league.name || "Brak nazwy"}
              </span>
            </div>
            <i
              className={`bi ${
                isFavorite("leagues", league.league.id)
                  ? "bi-star-fill text-warning"
                  : "bi-star"
              }`}
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation(); // Zapobieganie propagacji kliknięcia
                toggleFavorite("leagues", league.league);
              }}
            ></i>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <h5 className="mt-4">Favorite Teams</h5>
      <ListGroup>
        {!token && <p>You must be logged in to use this feature.</p>}
        {token && isFavoritesReady && favorites.teams.length === 0 && (
          <ListGroup.Item>You do not have any favorite teams.</ListGroup.Item>
        )}
        {favorites.teams.map((team) => (
          <ListGroup.Item
            key={team.team.id}
            className="d-flex align-items-center justify-content-between"
            onClick={() => navigate(`/team/${team.team.id}`)} // Przejście do strony drużyny
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center">
              <TeamImageVerySmall
                team={team.team}
                style={{ marginLeft: "0px" }}
              />
              <span style={{ marginLeft: "10px" }}>{team.team.name}</span>
            </div>
            <i
              className={`bi ${
                isFavorite("teams", team.team.id)
                  ? "bi-star-fill text-warning"
                  : "bi-star"
              }`}
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation(); // Zapobiegaj propagacji kliknięcia, aby nie aktywować nawigacji
                toggleFavorite("teams", team.team);
              }}
            ></i>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <h5 className="mt-4">All Leagues</h5>
      <ListGroup>
        {allLeagues.map((league) => (
          <ListGroup.Item
            key={league.id}
            className="d-flex justify-content-between align-items-center"
          >
            <div className="d-flex align-items-center">
              <img
                src={`/assets/flags/${league.country.code}.svg`}
                alt={league.country.name}
                style={{
                  width: "20px",
                  height: "15px",
                  marginRight: "10px",
                  borderRadius: "2px",
                  boxShadow: "0 0 2px rgba(0, 0, 0, 0.2)",
                }}
              />
              <span
                onClick={() => handleLeagueClick(league.id)}
                style={{ cursor: "pointer" }}
              >
                {league.name || "Unknown name"}
              </span>
            </div>
            <i
              className={`bi ${
                isFavorite("leagues", league.id)
                  ? "bi-star-fill text-warning"
                  : "bi-star"
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => toggleFavorite("leagues", league)}
            ></i>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <h5 className="mt-4">All Teams</h5>
      <ListGroup>
        {allTeams.map((team) => (
          <ListGroup.Item
            key={team.id}
            className="d-flex align-items-center justify-content-between"
            onClick={() => navigate(`/team/${team.id}`)} // Przejście do strony drużyny
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center">
              <TeamImageVerySmall team={team} style={{ marginLeft: "0px" }} />
              <span style={{ marginLeft: "10px" }}>{team.name}</span>
            </div>
            <i
              className={`bi ${
                isFavorite("teams", team.id)
                  ? "bi-star-fill text-warning"
                  : "bi-star"
              }`}
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation(); // Zapobiegaj propagacji kliknięcia, aby nie aktywować nawigacji
                toggleFavorite("teams", team);
              }}
            ></i>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
};

export default Sidebar;
