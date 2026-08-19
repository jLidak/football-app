import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Nav,
  ListGroup,
  Accordion,
  Modal,
  Form,
} from "react-bootstrap";
import Sidebar from "./Sidebar";
import TeamImageVerySmall from "./TeamImageVerySmall";
import UsePagination from "./UsePagination";
import PaginationComponent from "./PaginationComponent";
import LeagueStandings from "./LeagueStandings";

import MatchDetail from "./MatchDetail";
import RegistrationModal from "./RegistrationModal"; // Import RegistrationModal
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8080";

const LeaguePage = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [matches, setMatches] = useState([]);
  const [league, setLeague] = useState(null);
  const [activeTab, setActiveTab] = useState("matches");

  const [showMatchDetail, setShowMatchDetail] = useState(false); // Stan modala
  const [selectedMatch, setSelectedMatch] = useState(null); // Wybrany mecz
  const [showRegistrationModal, setShowRegistrationModal] = useState(false); // Stan dla modala rejestracji

  const [favorites, setFavorites] = useState({
    matches: [],
    leagues: [],
    teams: [],
  });
  const [isFavoritesReady, setIsFavoritesReady] = useState(false); // Flaga określająca gotowość

  const [userId, setUserId] = useState(null);

  const token = localStorage.getItem("jwtToken");

  // Filtrowanie i sortowanie z paginacją
  const filteredMatches = matches
    .filter(
      (match) => match.status === "UPCOMING" || match.status === "IN_PLAY",
    )
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
  const filteredResults = matches
    .filter((match) => match.status === "FINISHED")
    .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

  const matchesPagination = UsePagination(filteredMatches, 10);
  const resultsPagination = UsePagination(filteredResults, 10);

  const [editions, setEditions] = useState([]);
  const [selectedEdition, setSelectedEdition] = useState(null);

  useEffect(() => {
    // Pobierz dane ligi i edycje
    // Pobierz dane ligi i edycje
    axios
      .get(`${BASE_URL}/api/leagues/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setLeague(response.data);

        // Po wczytaniu ligi pobierz edycje
        return axios.get(`${BASE_URL}/api/leagues/${id}/editions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((response) => {
        setEditions(response.data);

        // Ustaw obecnie wczytaną ligę jako domyślną edycję w selektorze
        const currentEdition = response.data.find(
          (edition) => edition.id === parseInt(id),
        );
        setSelectedEdition(currentEdition || response.data[0]); // Jeśli nie znajdzie, ustaw pierwszą edycję
      })
      .catch((error) =>
        console.error("Error fetching league or editions:", error),
      );

    // Pobierz mecze ligi
    axios
      .get(`${BASE_URL}/api/matches/league/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setMatches(response.data))
      .catch((error) =>
        console.error("Error fetching matches for league:", error),
      );
  }, [id, token]);
  // Pobranie ID użytkownika
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

  // Pobranie ulubionych lig i drużyn
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

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/matches/league/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const fetchedMatches = response.data;

        // Dodaj pole isFavorite do każdego meczu
        setMatches(
          fetchedMatches.map((match) => ({
            ...match,
            isFavorite: favorites.matches.some(
              (fav) => fav.match.id === match.id,
            ),
          })),
        );
      } catch (error) {
        console.error("Error fetching matches for league:", error);
      }
    };

    fetchMatchesAndEvents();
  }, [id, token, favorites.matches]); // Zależność od favorites.matches

  const fetchEventsForMatches = async (matches) => {
    return Promise.all(
      matches.map(async (match) => {
        try {
          const response = await axios.get(
            `${BASE_URL}/api/events/match/${match.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          return { ...match, events: response.data }; // Dodaj zdarzenia do meczu
        } catch (error) {
          console.error(`Error fetching events for match ${match.id}:`, error);
          return match; // Jeśli wystąpi błąd, zwróć mecz bez zdarzeń
        }
      }),
    );
  };

  const fetchMatchesAndEvents = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/matches/league/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedMatches = response.data;

      // Pobierz zdarzenia dla wszystkich meczów
      const updatedMatches = await fetchEventsForMatches(fetchedMatches);

      // Zaktualizuj mecze w stanie
      setMatches(
        updatedMatches.map((match) => ({
          ...match,
          isFavorite: favorites.matches.some(
            (fav) => fav.match.id === match.id,
          ),
        })),
      );

      console.log("Updated Matches with Events:", updatedMatches);
    } catch (error) {
      console.error("Error fetching matches and events:", error);
    }
  };

  const handleMatchClick = (match) => {
    setSelectedMatch(match);
    setShowMatchDetail(true);
  };

  const calculateMatchMinute = (match) => {
    if (match.status === "FINISHED") {
      // Zwróć datę i godzinę meczu w formacie "DD.MM HH:mm"
      return new Date(match.dateTime)
        .toLocaleString("pl-PL", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(",", ""); // Usuwa przecinek między datą a godziną
    }

    if (match.status === "IN_PLAY") {
      const startEventTypes = [
        "MATCH_START",
        "SECOND_HALF_START",
        "OT_FIRST_HALF_START",
        "OT_SECOND_HALF_START",
        "PENALTIES_START",
      ];

      if (!match.events || !Array.isArray(match.events)) {
        console.warn(`No events available for match ${match.id}`);
        return "Live"; // Default fallback for matches without events
      }

      // Sort events by date in descending order
      const sortedEvents = [...match.events].sort(
        (a, b) => new Date(b.dateTime) - new Date(a.dateTime),
      );
      const startEvent = sortedEvents.find((event) =>
        startEventTypes.includes(event.type),
      );

      if (startEvent) {
        const startTime = new Date(startEvent.dateTime);
        const now = new Date();
        const diffInMinutes = Math.floor((now - startTime) / 60000) + 1;

        switch (startEvent.type) {
          case "MATCH_START":
            return diffInMinutes <= 45
              ? `${diffInMinutes}'`
              : `45+${diffInMinutes - 45}'`;

          case "SECOND_HALF_START":
            return diffInMinutes <= 45
              ? `45+${diffInMinutes}'`
              : `90+${diffInMinutes - 45}'`;

          case "OT_FIRST_HALF_START":
            return diffInMinutes <= 15
              ? `90+${diffInMinutes}'`
              : `105+${diffInMinutes - 15}'`;

          case "OT_SECOND_HALF_START":
            return diffInMinutes <= 15
              ? `105+${diffInMinutes}'`
              : `120+${diffInMinutes - 15}'`;

          case "PENALTIES_START":
            return "Penalties";

          default:
            return `${diffInMinutes}'`;
        }
      }

      console.warn(`No start event found for match ${match.id}`);
      return "Live"; // Fallback if no start event is found
    }

    return null; // For non-IN_PLAY and non-FINISHED statuses
  };

  const refetchFavorites = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/favorites/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const favoritesData = response.data;

      // Aktualizacja ulubionych w stanie
      setFavorites(favoritesData);

      // Oznaczenie ulubionych meczów w stanie matches
      setMatches((prevMatches) =>
        prevMatches.map((match) => ({
          ...match,
          isFavorite: favoritesData.matches.some(
            (fav) => fav.match.id === match.id,
          ),
        })),
      );

      console.log("Favorites refreshed:", favoritesData);
    } catch (error) {
      console.error("Error fetching updated favorites:", error);
    }
  };

  const toggleFavorite = async (type, item) => {
    if (!token) {
      // Otwórz modal rejestracji, jeśli użytkownik nie jest zalogowany
      setShowRegistrationModal(true);
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

      // Aktualizuj tylko ten jeden mecz
      setMatches((prevMatches) =>
        prevMatches.map((match) =>
          match.id === item.id
            ? { ...match, isFavorite: !isFavoriteItem }
            : match,
        ),
      );

      // Odświeżanie ulubionych po każdej operacji
      await refetchFavorites();
    } catch (error) {
      console.error(`Error toggling favorite ${type}:`, error);
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

  const handleEditionChange = (newEditionId) => {
    const selected = editions.find(
      (edition) => edition.id === parseInt(newEditionId),
    );
    setSelectedEdition(selected);
    if (selected) {
      navigate(`/league/${selected.id}`); // Przejdź na stronę ligi z wybraną edycją
    }
  };

  const renderMatches = () => {
    const { currentResults, totalPages, currentPage, handlePageChange } =
      matchesPagination;

    let lastRound = null;
    let lastRoundStage = null; // Inicjalizacja zmiennych

    return (
      <>
        <Card className="mb-4" style={{ width: "100%", margin: "0 auto" }}>
          <Card.Body>
            <ListGroup variant="flush">
              {currentResults.map((match) => {
                const isNewRound =
                  match.round !== lastRound ||
                  match.stage.name !== lastRoundStage;

                // Aktualizacja zmiennych lastRound i lastRoundStage
                lastRound = match.round;
                lastRoundStage = match.stage.name;

                // Ustal etykietę dla rundy
                let roundLabel = `Round ${match.round}`;
                if (match.stage.name !== "GROUP") {
                  switch (match.stage.name) {
                    case "1/2":
                      roundLabel = "SEMI-FINALS";
                      break;
                    case "FINAL":
                      roundLabel = "FINAL";
                      break;
                    case "1/4":
                      roundLabel = "QUARTER-FINALS";
                      break;
                    case "1/8":
                      roundLabel = "ROUND OF 16";
                      break;
                    default:
                      roundLabel = `${match.stage.name}-FINALS`;
                  }
                }

                return (
                  <React.Fragment key={match.id}>
                    {/* Dodaj linię z nazwą rundy, jeśli jest nowa */}
                    {isNewRound && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "20px 0",
                          position: "relative",
                        }}
                      >
                        <hr
                          style={{
                            flexGrow: 1,
                            borderTop: "1px solid #ccc",
                          }}
                        />
                        <span
                          style={{
                            padding: "0 10px",
                            backgroundColor: "#fff",
                            fontWeight: "bold",
                            color: "#555",
                          }}
                        >
                          {roundLabel}
                        </span>
                        <hr
                          style={{
                            flexGrow: 1,
                            borderTop: "1px solid #ccc",
                          }}
                        />
                      </div>
                    )}

                    {/* Wyświetlenie meczu */}
                    <ListGroup.Item
                      key={match.id}
                      className="d-flex align-items-center justify-content-between"
                      style={{ cursor: "pointer" }}
                    >
                      <i
                        className={`bi ${
                          match.isFavorite
                            ? "bi-star-fill text-warning"
                            : "bi-star"
                        }`}
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation(); // Zapobiegaj otwieraniu modala przy kliknięciu w gwiazdkę
                          toggleFavorite("matches", match);
                        }}
                      ></i>
                      <span
                        style={{
                          marginRight: "15px",
                          marginLeft: "15px",
                          width: "90px",
                          textAlign: "center",
                          display: "inline-block",
                          backgroundColor:
                            match.status === "IN_PLAY"
                              ? "rgba(255, 0, 0, 0.6)"
                              : "transparent",
                          borderRadius: "5px",
                          padding: "5px",
                        }}
                        onClick={() => handleMatchClick(match)}
                      >
                        {match.status === "IN_PLAY"
                          ? calculateMatchMinute(match)
                          : new Date(match.dateTime)
                              .toLocaleString("pl-PL", {
                                day: "2-digit",
                                month: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                              .replace(",", "")}
                      </span>
                      <div
                        style={{ flex: 1 }}
                        onClick={() => handleMatchClick(match)}
                      >
                        <div className="d-flex align-items-center">
                          <TeamImageVerySmall team={match.homeTeam} />
                          <span style={{ marginLeft: "10px" }}>
                            {match.homeTeam.name}
                          </span>
                        </div>
                        <div className="d-flex align-items-center">
                          <TeamImageVerySmall team={match.awayTeam} />
                          <span style={{ marginLeft: "10px" }}>
                            {match.awayTeam.name}
                          </span>
                        </div>
                      </div>
                      {match.status === "IN_PLAY" ||
                      match.status === "FINISHED" ? (
                        <span style={{ marginRight: "40px" }}>
                          <div style={{ textAlign: "right" }}>
                            <div>{match.homeGoals}</div>
                            <div>{match.awayGoals}</div>
                          </div>
                        </span>
                      ) : null}
                    </ListGroup.Item>
                  </React.Fragment>
                );
              })}
            </ListGroup>
          </Card.Body>
        </Card>
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </>
    );
  };

  const renderResults = () => {
    const { currentResults, totalPages, currentPage, handlePageChange } =
      resultsPagination;

    let lastRound = null;
    let lastRoundStage = null; // Inicjalizacja zmiennej przed użyciem

    return (
      <>
        <Card className="mb-4" style={{ width: "100%", margin: "0 auto" }}>
          <Card.Body>
            <ListGroup variant="flush">
              {currentResults.map((match) => {
                const isNewRound =
                  match.round !== lastRound ||
                  match.stage.name !== lastRoundStage;

                // Aktualizacja zmiennych lastRound i lastRoundStage
                lastRound = match.round;
                lastRoundStage = match.stage.name;

                // Ustal etykietę dla rundy
                let roundLabel = `Round ${match.round}`;
                if (match.stage.name !== "GROUP") {
                  switch (match.stage.name) {
                    case "1/2":
                      roundLabel = "SEMI-FINALS";
                      break;
                    case "FINAL":
                      roundLabel = "FINAL";
                      break;
                    case "1/4":
                      roundLabel = "QUARTER-FINALS";
                      break;
                    case "1/8":
                      roundLabel = "ROUND OF 16";
                      break;
                    default:
                      roundLabel = `${match.stage.name}-FINALS`;
                  }
                }

                return (
                  <React.Fragment key={match.id}>
                    {/* Dodaj linię z nazwą rundy, jeśli jest nowa */}
                    {isNewRound && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "20px 0",
                          position: "relative",
                        }}
                      >
                        <hr
                          style={{
                            flexGrow: 1,
                            borderTop: "1px solid #ccc",
                          }}
                        />
                        <span
                          style={{
                            padding: "0 10px",
                            backgroundColor: "#fff",
                            fontWeight: "bold",
                            color: "#555",
                          }}
                        >
                          {roundLabel}
                        </span>
                        <hr
                          style={{
                            flexGrow: 1,
                            borderTop: "1px solid #ccc",
                          }}
                        />
                      </div>
                    )}

                    {/* Wyświetlenie meczu */}
                    <ListGroup.Item
                      key={match.id}
                      className="d-flex align-items-center justify-content-between"
                      style={{ cursor: "pointer" }}
                    >
                      <i
                        className={`bi ${
                          match.isFavorite
                            ? "bi-star-fill text-warning"
                            : "bi-star"
                        }`}
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation(); // Zapobiegaj otwieraniu modala przy kliknięciu w gwiazdkę
                          toggleFavorite("matches", match);
                        }}
                      ></i>
                      <span
                        style={{
                          marginRight: "15px",
                          marginLeft: "15px",
                          width: "90px",
                          textAlign: "center",
                          display: "inline-block",
                          backgroundColor:
                            match.status === "IN_PLAY"
                              ? "rgba(255, 0, 0, 0.6)"
                              : "transparent",
                          borderRadius: "5px",
                          padding: "5px",
                        }}
                        onClick={() => handleMatchClick(match)}
                      >
                        {calculateMatchMinute(match)}
                      </span>
                      <div
                        style={{ flex: 1 }}
                        onClick={() => handleMatchClick(match)}
                      >
                        <div className="d-flex align-items-center">
                          <TeamImageVerySmall team={match.homeTeam} />
                          <span style={{ marginLeft: "10px" }}>
                            {match.homeTeam.name}
                          </span>
                        </div>
                        <div className="d-flex align-items-center">
                          <TeamImageVerySmall team={match.awayTeam} />
                          <span style={{ marginLeft: "10px" }}>
                            {match.awayTeam.name}
                          </span>
                        </div>
                      </div>
                      {match.status === "IN_PLAY" ||
                      match.status === "FINISHED" ? (
                        <span style={{ marginRight: "40px" }}>
                          <div style={{ textAlign: "right" }}>
                            <div>{match.homeGoals}</div>
                            <div>{match.awayGoals}</div>
                          </div>
                        </span>
                      ) : null}
                    </ListGroup.Item>
                  </React.Fragment>
                );
              })}
            </ListGroup>
          </Card.Body>
        </Card>
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </>
    );
  };

  const renderStandings = () => {
    return (
      <>
        <div className="mt-4">
          <LeagueStandings leagueId={league.id} />
        </div>
      </>
    );
  };

  if (!league) return <p>Loading league...</p>;

  return (
    <Container fluid>
      {/* Menu rozwijane na małych ekranach */}
      <Accordion className="d-md-none mb-4 mt-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Menu</Accordion.Header>
          <Accordion.Body>
            <Sidebar />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Row className="flex-column flex-md-row">
        {/* Menu boczne na dużych ekranach */}
        <Col md={3} className="bg-light border-right order-2 order-md-1">
          <div className="d-none d-md-block">
            <Sidebar />
          </div>
        </Col>

        <Col md={9} className="mb-2 order-1 order-md-2">
          <h3 className="mt-4">{league.name}</h3>

          <Form.Group controlId="formEditionSelect" className="mt-3 mb-3">
            <Form.Select
              value={selectedEdition?.id || ""}
              onChange={(e) => handleEditionChange(e.target.value)}
            >
              {editions.map((edition) => (
                <option key={edition.id} value={edition.id}>
                  {edition.edition}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Nav
            variant="tabs"
            activeKey={activeTab}
            onSelect={(selectedKey) => setActiveTab(selectedKey)}
          >
            <Nav.Item>
              <Nav.Link eventKey="matches">Matches</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="results">Results</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="standings">Standings</Nav.Link>
            </Nav.Item>
          </Nav>
          {activeTab === "matches" && renderMatches()}
          {activeTab === "results" && renderResults()}
          {activeTab === "standings" && renderStandings()}
        </Col>
      </Row>

      {/* Modal MatchDetail */}
      {showMatchDetail && selectedMatch && (
        <MatchDetail
          show={showMatchDetail}
          onHide={() => setShowMatchDetail(false)}
          match={selectedMatch}
          toggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
          onOpenRegistration={() => setShowRegistrationModal(true)} // Funkcja otwierająca modal rejestracji
        />
      )}

      {/* Modal Registration */}
      <RegistrationModal
        show={showRegistrationModal}
        onHide={() => setShowRegistrationModal(false)}
      />
    </Container>
  );
};

export default LeaguePage;
