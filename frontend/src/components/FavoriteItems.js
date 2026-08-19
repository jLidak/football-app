import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Bootstrap Icons

const BASE_URL = "http://localhost:8080";

const FavoriteItems = () => {
  const [teams, setTeams] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [matches, setMatches] = useState([]);
  const [favorites, setFavorites] = useState({
    teams: [],
    leagues: [],
    matches: [],
  });
  const [userId, setUserId] = useState(null);

  const token = localStorage.getItem("jwtToken");

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
    } else {
      console.error("JWT token is missing.");
      return;
    }
  }, [token]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/teams`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setTeams(response.data))
      .catch((error) => console.error("Error fetching teams:", error));

    axios
      .get(`${BASE_URL}/api/leagues`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setLeagues(response.data))
      .catch((error) => console.error("Error fetching leagues:", error));

    axios
      .get(`${BASE_URL}/api/matches`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setMatches(response.data))
      .catch((error) => console.error("Error fetching matches:", error));
  }, [token]);

  useEffect(() => {
    if (userId) {
      axios
        .get(`${BASE_URL}/api/favorites/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("Favorites fetched:", response.data); // Log danych ulubionych
          setFavorites(response.data);
        })
        .catch((error) => console.error("Error fetching favorites:", error));
    }
  }, [userId, token]);

  const toggleFavorite = async (type, item) => {
    console.log("Toggling favorite:", type, item);

    if (!userId || !item || !item.id) {
      console.error("Invalid userId or item.");
      return;
    }

    // Convert plural type like "teams" to singular form "team" for endpoint map
    const singularType = type.slice(0, -1);

    const isFavorite = favorites[singularType]?.some(
      (fav) => fav[singularType]?.id === item.id,
    );

    const endpointMap = {
      team: isFavorite
        ? `${BASE_URL}/api/favorite-teams/remove`
        : `${BASE_URL}/api/favorite-teams/add`,
      league: isFavorite
        ? `${BASE_URL}/api/favorite-leagues/remove`
        : `${BASE_URL}/api/favorite-leagues/add`,
      match: isFavorite
        ? `${BASE_URL}/api/favorite-matches/remove`
        : `${BASE_URL}/api/favorite-matches/add`,
    };

    const dataMap = {
      team: { teamId: item.id, userId },
      league: { leagueId: item.id, userId },
      match: { matchId: item.id, userId },
    };

    console.log("Endpoint:", endpointMap[singularType]);
    console.log("Data:", dataMap[singularType]);

    try {
      if (isFavorite) {
        await axios.delete(endpointMap[singularType], {
          data: dataMap[singularType],
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(endpointMap[singularType], dataMap[singularType], {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      refetchFavorites();
    } catch (error) {
      console.error(`Error toggling favorite ${type}:`, error);
      refetchFavorites();
    }
  };

  const refetchFavorites = () => {
    axios
      .get(`${BASE_URL}/api/favorites/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setFavorites(response.data))
      .catch((error) =>
        console.error("Error fetching updated favorites:", error),
      );
  };

  const isFavorite = (type, id) => {
    return favorites[type].some((fav) => fav[`${type.slice(0, -1)}`].id === id);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">All Items</h2>
      <div className="row">
        <div className="col-md-4">
          <h3>Teams</h3>
          <ul className="list-group">
            {teams.map((team) => (
              <li
                key={team.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {team.name}
                <i
                  className={`bi ${isFavorite("teams", team.id) ? "bi-star-fill text-warning" : "bi-star"}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleFavorite("teams", team)}
                ></i>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-4">
          <h3>Leagues</h3>
          <ul className="list-group">
            {leagues.map((league) => (
              <li
                key={league.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {league.name}
                <i
                  className={`bi ${isFavorite("leagues", league.id) ? "bi-star-fill text-warning" : "bi-star"}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleFavorite("leagues", league)}
                ></i>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-4">
          <h3>Matches</h3>
          <ul className="list-group">
            {matches.map((match) => (
              <li
                key={match.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                Match ID: {match.id}
                <i
                  className={`bi ${isFavorite("matches", match.id) ? "bi-star-fill text-warning" : "bi-star"}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleFavorite("matches", match)}
                ></i>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FavoriteItems;
