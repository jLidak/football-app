import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  ListGroup,
  Modal,
  Alert,
  Card,
} from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import EventManagement from "./EventManagement";
import { useNavigate } from "react-router-dom";
import UsePagination from "./UsePagination";
import PaginationComponent from "./PaginationComponent";

const MatchSearchAndEditForm = () => {
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [editData, setEditData] = useState({
    dateTime: "",
    referee: null,
    stadium: null,
    league: null,
    homeTeam: null,
    awayTeam: null,
    round: "",
    status: "UPCOMING",
    isBetable: false,
    homeGoals: 0,
    awayGoals: 0,
    homePossession: 0,
    awayPossession: 0,
    homePasses: 0,
    awayPasses: 0,
    homeAccuratePasses: 0,
    awayAccuratePasses: 0,
    homeShots: 0,
    awayShots: 0,
    homeShotsOnGoal: 0,
    awayShotsOnGoal: 0,
    homeCorners: 0,
    awayCorners: 0,
    homeOffside: 0,
    awayOffside: 0,
    homeFouls: 0,
    awayFouls: 0,
  });
  const [filteredReferees, setFilteredReferees] = useState([]);
  const [filteredStadiums, setFilteredStadiums] = useState([]);
  const [filteredLeagues, setFilteredLeagues] = useState([]);
  const [filteredHomeTeams, setFilteredHomeTeams] = useState([]);
  const [filteredAwayTeams, setFilteredAwayTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [homeTeamSearchQuery, setHomeTeamSearchQuery] = useState("");
  const [awayTeamSearchQuery, setAwayTeamSearchQuery] = useState("");
  const [refereeSearchQuery, setRefereeSearchQuery] = useState("");
  const [stadiumSearchQuery, setStadiumSearchQuery] = useState("");
  const [leagueSearchQuery, setLeagueSearchQuery] = useState("");

  const [selectedReferee, setSelectedReferee] = useState(null);
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [selectedHomeTeam, setSelectedHomeTeam] = useState(null);
  const [selectedAwayTeam, setSelectedAwayTeam] = useState(null);

  const [matchStatus, setMatchStatus] = useState("UPCOMING");
  const [dateTime, setDateTime] = useState("");
  const [round, setRound] = useState("");
  const [stageType, setStageType] = useState("OTHER");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);
  const [homePossession, setHomePossession] = useState(0);
  const [awayPossession, setAwayPossession] = useState(0);
  const [homePasses, setHomePasses] = useState(0);
  const [awayPasses, setAwayPasses] = useState(0);
  const [homeAccuratePasses, setHomeAccuratePasses] = useState(0);
  const [awayAccuratePasses, setAwayAccuratePasses] = useState(0);
  const [homeShots, setHomeShots] = useState(0);
  const [awayShots, setAwayShots] = useState(0);
  const [homeShotsOnGoal, setHomeShotsOnGoal] = useState(0);
  const [awayShotsOnGoal, setAwayShotsOnGoal] = useState(0);
  const [homeCorners, setHomeCorners] = useState(0);
  const [awayCorners, setAwayCorners] = useState(0);
  const [homeOffside, setHomeOffside] = useState(0);
  const [awayOffside, setAwayOffside] = useState(0);
  const [homeFouls, setHomeFouls] = useState(0);
  const [awayFouls, setAwayFouls] = useState(0);

  const [stageOptions, setStageOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);

  const [showManageEvents, setShowManageEvents] = useState(false); // Toggle state for Manage Events view

  const [noResultsMessage, setNoResultsMessage] = useState("");
  const [teamError, setTeamError] = useState("");
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    currentResults,
    handlePageChange,
  } = UsePagination(matches, 10);

  // Modal-related states
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeagueName, setSelectedLeagueName] = useState(null);
  const [editions, setEditions] = useState([]);
  const [selectedEdition, setSelectedEdition] = useState(null);

  const [showLeagueModal, setShowLeagueModal] = useState(false);

  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/matches", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Fetched matches:", response.data); // Debugowanie danych
        const sortedMatches = response.data.sort(
          (a, b) => new Date(a.dateTime) - new Date(b.dateTime),
        );
        setMatches(sortedMatches);
        setCurrentPage(1);
        setNoResultsMessage(
          response.data.length === 0 ? "No results found." : "",
        );
      })
      .catch((error) => console.error("Error fetching matches:", error));
  }, []);

  useEffect(() => {
    if (homeTeamSearchQuery) {
      if (selectedHomeTeam && homeTeamSearchQuery !== selectedHomeTeam.name) {
        setSelectedHomeTeam(null);
      }

      const token = localStorage.getItem("jwtToken");
      axios
        .get(
          `http://localhost:8080/api/teams/search?query=${homeTeamSearchQuery}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then((response) => setFilteredHomeTeams(response.data))
        .catch((error) => console.error("Error fetching home teams:", error));
    } else {
      setFilteredHomeTeams([]);
    }
  }, [homeTeamSearchQuery, selectedHomeTeam]);

  useEffect(() => {
    if (awayTeamSearchQuery) {
      if (selectedAwayTeam && awayTeamSearchQuery !== selectedAwayTeam.name) {
        setSelectedAwayTeam(null);
      }
      const token = localStorage.getItem("jwtToken");
      axios
        .get(
          `http://localhost:8080/api/teams/search?query=${awayTeamSearchQuery}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then((response) => setFilteredAwayTeams(response.data))
        .catch((error) => console.error("Error fetching away teams:", error));
    } else {
      setFilteredAwayTeams([]);
    }
  }, [awayTeamSearchQuery, selectedAwayTeam]);

  useEffect(() => {
    if (refereeSearchQuery) {
      if (
        selectedReferee &&
        refereeSearchQuery !==
          `${selectedReferee.firstName} ${selectedReferee.lastName}`
      ) {
        setSelectedReferee(null);
      }
      const token = localStorage.getItem("jwtToken");
      axios
        .get(
          `http://localhost:8080/api/referees/search?query=${refereeSearchQuery}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then((response) => setFilteredReferees(response.data))
        .catch((error) => console.error("Error fetching referees:", error));
    } else {
      setFilteredReferees([]);
    }
  }, [refereeSearchQuery, selectedReferee]);

  useEffect(() => {
    if (stadiumSearchQuery) {
      if (selectedStadium && stadiumSearchQuery !== selectedStadium.name) {
        setSelectedStadium(null);
      }
      const token = localStorage.getItem("jwtToken");
      axios
        .get(
          `http://localhost:8080/api/stadiums/search?query=${stadiumSearchQuery}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then((response) => setFilteredStadiums(response.data))
        .catch((error) => console.error("Error fetching stadiums:", error));
    } else {
      setFilteredStadiums([]);
    }
  }, [stadiumSearchQuery, selectedStadium]);

  useEffect(() => {
    if (leagueSearchQuery) {
      if (selectedLeague && leagueSearchQuery !== selectedLeague.name) {
        setSelectedLeague(null);
      }
      const token = localStorage.getItem("jwtToken");
      axios
        .get(
          `http://localhost:8080/api/leagues/search?query=${leagueSearchQuery}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then((response) => setFilteredLeagues(response.data))
        .catch((error) => console.error("Error fetching leagues:", error));
    } else {
      setFilteredLeagues([]);
    }
  }, [leagueSearchQuery, selectedLeague]);

  useEffect(() => {
    const fetchStages = async () => {
      const token = localStorage.getItem("jwtToken");
      try {
        const response = await axios.get(
          "http://localhost:8080/api/leagueStages",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setStageOptions(response.data); // Ustawienie opcji faz
      } catch (error) {
        console.error("Error fetching stages:", error);
      }
    };

    fetchStages();
  }, []);

  const handleEditClick = (match) => {
    setSelectedMatch(match.id);
    setEditData({
      dateTime: match.dateTime,
      referee: match.referee ? match.referee.id : null,
      stadium: match.stadium ? match.stadium.id : null,
      league: match.league ? match.league.id : null,
      homeTeam: match.homeTeam ? match.homeTeam.id : null,
      awayTeam: match.awayTeam ? match.awayTeam.id : null,
      round: match.round,
      status: match.status,
      isBetable: match.isBetable,
      stageType: match.stageType || "OTHER",
      selectedStage:
        match.stage ||
        (match.stageType === "OTHER" ? { id: 11, name: "OTHER" } : null), // Domyślny stage dla OTHER
      homeGoals: match.homeGoals || 0,
      awayGoals: match.awayGoals || 0,
      homePossession: match.homePossession || 0,
      awayPossession: match.awayPossession || 0,
      homePasses: match.homePasses || 0,
      awayPasses: match.awayPasses || 0,
      homeAccuratePasses: match.homeAccuratePasses || 0,
      awayAccuratePasses: match.awayAccuratePasses || 0,
      homeShots: match.homeShots || 0,
      awayShots: match.awayShots || 0,
      homeShotsOnGoal: match.homeShotsOnGoal || 0,
      awayShotsOnGoal: match.awayShotsOnGoal || 0,
      homeCorners: match.homeCorners || 0,
      awayCorners: match.awayCorners || 0,
      homeOffside: match.homeOffside || 0,
      awayOffside: match.awayOffside || 0,
      homeFouls: match.homeFouls || 0,
      awayFouls: match.awayFouls || 0,
    });
    setHomeTeamSearchQuery(match.homeTeam.name);
    setAwayTeamSearchQuery(match.awayTeam.name);
    setRefereeSearchQuery(
      `${match.referee.firstName} ${match.referee.lastName}`,
    );
    setStadiumSearchQuery(match.stadium.name);
    setLeagueSearchQuery(match.league.name);

    setSelectedHomeTeam(match.homeTeam);
    setSelectedAwayTeam(match.awayTeam);
    setSelectedReferee(match.referee);
    setSelectedStadium(match.stadium);
    setSelectedLeague(match.league);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    if (
      selectedHomeTeam &&
      selectedAwayTeam &&
      selectedHomeTeam.id === selectedAwayTeam.id
    ) {
      setTeamError("Home Team and Away Team cannot be the same.");
      return;
    } else {
      setTeamError("");
    }

    const updatedMatch = {
      ...editData,
      referee: { id: editData.referee },
      stadium: { id: editData.stadium },
      league: { id: editData.league },
      homeTeam: { id: editData.homeTeam },
      awayTeam: { id: editData.awayTeam },
      stage: editData.selectedStage, // Dodaj wybrany stage
    };

    axios
      .put(`http://localhost:8080/api/matches/${selectedMatch}`, updatedMatch, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Match updated successfully");
        setSelectedMatch(null);
      })
      .catch((error) => {
        console.error("Error updating match:", error);
        alert("Failed to update match");
      });
  };

  //
  // const handleManageEventsClick = (match) => {
  //     setSelectedMatch(match);
  //     setShowManageEvents(true); // Toggle to Manage Events view
  // };

  const handleManageEventsClick = (match) => {
    setSelectedMatch(match);
    setShowManageEvents(true);
    //navigate(`/manage-events/${match.id}`);
  };

  const handleHomeTeamSelect = (team) => {
    setSelectedHomeTeam(team);
    setEditData((prev) => ({ ...prev, homeTeam: team.id }));
  };

  const handleAwayTeamSelect = (team) => {
    setSelectedAwayTeam(team);
    setEditData((prev) => ({ ...prev, awayTeam: team.id }));
  };

  const handleRefereeSelect = (ref) => {
    setSelectedReferee(ref);
    setEditData((prev) => ({ ...prev, referee: ref.id }));
  };

  const handleStadiumSelect = (stadium) => {
    setSelectedStadium(stadium);
    setEditData((prev) => ({ ...prev, stadium: stadium.id }));
  };

  // Fetch distinct countries when modal opens
  const handleOpenLeagueModal = () => {
    // Resetuj stany związane z wyborem
    setSelectedCountry(null);
    setSelectedLeagueName(null);
    setSelectedEdition(null);
    setCountries([]); // Możesz zostawić puste lub pobrać na nowo w tym miejscu
    setLeagues([]);
    setEditions([]);

    // Pobierz kraje z serwera
    const token = localStorage.getItem("jwtToken");
    axios
      .get("http://localhost:8080/api/leagues/countries", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setCountries(response.data))
      .catch((error) => console.error("Error fetching countries:", error));

    setShowLeagueModal(true); // Pokaż modal
  };
  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setSelectedLeagueName(null);
    setSelectedEdition(null);

    const token = localStorage.getItem("jwtToken");

    axios
      .get(`http://localhost:8080/api/leagues/byCountry?country=${country}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setLeagues(response.data);
      })
      .catch((error) => {
        console.error("Error fetching leagues:", error);
        alert("Failed to load leagues");
      });
  };
  const handleSelectLeagueName = (leagueName) => {
    setSelectedLeagueName(leagueName);
    setSelectedEdition(null);

    const token = localStorage.getItem("jwtToken");

    axios
      .get(
        `http://localhost:8080/api/leagues/editions?leagueName=${leagueName}&country=${selectedCountry}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((response) => {
        setEditions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching editions:", error);
        alert("Failed to load editions");
      });
  };
  const handleSelectEdition = (edition) => {
    setSelectedEdition(edition);

    const token = localStorage.getItem("jwtToken");

    axios
      .get(
        `http://localhost:8080/api/leagues/getByDetails?country=${selectedCountry}&name=${selectedLeagueName}&edition=${edition}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((response) => {
        setSelectedLeague(response.data);
        setShowLeagueModal(false); // Zamknij modal po wyborze
      })
      .catch((error) => {
        console.error("Error fetching league by details:", error);
        alert("Failed to load league details");
      });
  };

  if (showManageEvents && selectedMatch) {
    return (
      <Container className="mt-5">
        <Button variant="secondary" onClick={() => setShowManageEvents(false)}>
          Back to Matches
        </Button>
        <EventManagement
          matchId={selectedMatch.id}
          matchDetails={selectedMatch}
        />
      </Container>
    );
  }
  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Search and Edit Matches</h1>
      {currentResults.length > 0 && (
        <div>
          <h3 className="text-center mb-3">Matches:</h3>
          <Container>
            {currentResults.map((match) => (
              <React.Fragment key={match.id}>
                <Card className="mb-3 shadow-sm">
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>ID:</strong> {match.id}
                      <br />
                      <strong>Date:</strong>{" "}
                      {new Date(match.dateTime).toLocaleString()}
                      <br />
                      <strong>Round:</strong> {match.round}
                      <br />
                      <strong>Status:</strong> {match.status}
                      <br />
                      <strong>Home Team:</strong>{" "}
                      {match.homeTeam ? match.homeTeam.name : "N/A"}
                      <br />
                      <strong>Away Team:</strong>{" "}
                      {match.awayTeam ? match.awayTeam.name : "N/A"}
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        onClick={() => handleEditClick(match)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleManageEventsClick(match)}
                      >
                        Manage Events
                      </Button>
                    </div>
                  </Card.Body>
                </Card>

                {selectedMatch === match.id && (
                  <div className="p-4 border rounded shadow-sm bg-light mb-3">
                    <h3 className="text-center mb-4">Edit Match</h3>
                    <Form onSubmit={handleEditSubmit}>
                      {/* Match Status */}
                      <Form.Group controlId="formMatchStatus" className="mb-3">
                        <Form.Label>Match Status</Form.Label>
                        <Form.Control
                          as="select"
                          value={editData.status}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              status: e.target.value,
                            }))
                          }
                          required
                        >
                          <option value="UPCOMING">UPCOMING</option>
                          <option value="IN_PLAY">IN_PLAY</option>
                          <option value="FINISHED">FINISHED</option>
                        </Form.Control>
                      </Form.Group>

                      {/* Match Date and Time */}
                      <Form.Group controlId="formDateTime" className="mb-3">
                        <Form.Label>Date and Time</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          value={editData.dateTime}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              dateTime: e.target.value,
                            }))
                          }
                          required
                        />
                      </Form.Group>

                      {/* Match Round */}
                      <Form.Group controlId="formRound" className="mb-3">
                        <Form.Label>Round</Form.Label>
                        <Form.Control
                          type="text"
                          value={editData.round}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              round: e.target.value,
                            }))
                          }
                          required
                        />
                      </Form.Group>

                      <Form.Group controlId="formHomeTeam" className="mb-3">
                        <Form.Label>Home Team</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Search for a home team"
                          value={homeTeamSearchQuery}
                          onChange={(e) =>
                            setHomeTeamSearchQuery(e.target.value)
                          }
                          required
                        />
                        {filteredHomeTeams.length > 0 && !selectedHomeTeam && (
                          <ListGroup>
                            {filteredHomeTeams.map((team) => (
                              <ListGroup.Item
                                key={team.id}
                                action
                                onClick={() => handleHomeTeamSelect(team)}
                              >
                                {team.name}
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        )}
                      </Form.Group>

                      <Form.Group controlId="formAwayTeam" className="mb-3">
                        <Form.Label>Away Team</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Search for an away team"
                          value={awayTeamSearchQuery}
                          onChange={(e) =>
                            setAwayTeamSearchQuery(e.target.value)
                          }
                          required
                        />
                        {filteredAwayTeams.length > 0 && !selectedAwayTeam && (
                          <ListGroup>
                            {filteredAwayTeams.map((team) => (
                              <ListGroup.Item
                                key={team.id}
                                action
                                onClick={() => handleAwayTeamSelect(team)}
                              >
                                {team.name}
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        )}
                      </Form.Group>

                      <Form.Group controlId="formReferee" className="mb-3">
                        <Form.Label>Referee</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Search for a referee"
                          value={refereeSearchQuery}
                          onChange={(e) =>
                            setRefereeSearchQuery(e.target.value)
                          }
                          required
                        />
                        {filteredReferees.length > 0 && !selectedReferee && (
                          <ListGroup>
                            {filteredReferees.map((ref) => (
                              <ListGroup.Item
                                key={ref.id}
                                action
                                onClick={() => handleRefereeSelect(ref)}
                              >
                                {ref.firstName} {ref.lastName}
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        )}
                      </Form.Group>

                      <Form.Group controlId="formStadium" className="mb-3">
                        <Form.Label>Stadium</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Search for a stadium"
                          value={stadiumSearchQuery}
                          onChange={(e) =>
                            setStadiumSearchQuery(e.target.value)
                          }
                          required
                        />
                        {filteredStadiums.length > 0 && !selectedStadium && (
                          <ListGroup>
                            {filteredStadiums.map((stad) => (
                              <ListGroup.Item
                                key={stad.id}
                                action
                                onClick={() => handleStadiumSelect(stad)}
                              >
                                {stad.name}
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        )}
                      </Form.Group>

                      {/*<Form.Group controlId="formLeague" className="mb-3">*/}
                      {/*    <Form.Label>League</Form.Label>*/}
                      {/*    <Form.Control*/}
                      {/*        type="text"*/}
                      {/*        placeholder="Search for a league"*/}
                      {/*        value={leagueSearchQuery}*/}
                      {/*        onChange={(e) => setLeagueSearchQuery(e.target.value)}*/}
                      {/*        required*/}
                      {/*    />*/}
                      {/*    {filteredLeagues.length > 0 && !selectedLeague && (*/}
                      {/*        <ListGroup>*/}
                      {/*            {filteredLeagues.map((league) => (*/}
                      {/*                <ListGroup.Item*/}
                      {/*                    key={league.id}*/}
                      {/*                    action*/}
                      {/*                    onClick={() => handleLeagueSelect(league)}*/}
                      {/*                >*/}
                      {/*                    {league.name}*/}
                      {/*                </ListGroup.Item>*/}
                      {/*            ))}*/}
                      {/*        </ListGroup>*/}
                      {/*    )}*/}
                      {/*</Form.Group>*/}

                      <Form.Group controlId="formLeague" className="mb-3">
                        <Form.Label>League</Form.Label>

                        <Button
                          variant="outline-primary"
                          onClick={handleOpenLeagueModal}
                          className="w-100"
                        >
                          {selectedLeague
                            ? `${selectedLeague.name} (${selectedLeague.country?.name || "Unknown Country"}, Edition: ${selectedLeague.edition})`
                            : "Select League"}
                        </Button>
                      </Form.Group>

                      {/* Stage Type */}
                      <Form.Group controlId="formStageType" className="mb-3">
                        <Form.Label>Stage Type</Form.Label>
                        <Form.Control
                          as="select"
                          value={editData.stageType || "OTHER"}
                          onChange={(e) => {
                            const selectedType = e.target.value;
                            setEditData((prev) => ({
                              ...prev,
                              stageType: selectedType,
                              selectedStage:
                                selectedType === "OTHER"
                                  ? { id: 11, name: "OTHER" } // Domyślny stage dla OTHER
                                  : null,
                            }));

                            if (selectedType === "GROUP_STAGE") {
                              const groupStage = stageOptions.find(
                                (stage) => stage.id === 1,
                              );
                              if (groupStage) {
                                setEditData((prev) => ({
                                  ...prev,
                                  selectedStage: groupStage,
                                }));
                              }
                            } else if (selectedType === "KNOCKOUT_STAGE") {
                              setEditData((prev) => ({
                                ...prev,
                                selectedStage: null, // Dla Knockout Stage, trzeba wybrać z opcji
                              }));
                            }
                          }}
                          required
                        >
                          <option value="OTHER">Other</option>
                          <option value="GROUP_STAGE">Group Stage</option>
                          <option value="KNOCKOUT_STAGE">Knockout Stage</option>
                        </Form.Control>
                      </Form.Group>

                      {/* Group Selection for Group Stage */}
                      {editData.stageType === "GROUP_STAGE" && (
                        <Form.Group controlId="formGroup" className="mb-3">
                          <Form.Label>Group</Form.Label>
                          <Form.Control
                            as="select"
                            value={editData.selectedGroup?.id || ""}
                            onChange={(e) => {
                              const group = groupOptions.find(
                                (g) => g.id.toString() === e.target.value,
                              );
                              setEditData((prev) => ({
                                ...prev,
                                selectedGroup: group,
                              }));
                            }}
                            required
                          >
                            <option value="" disabled>
                              Select a group
                            </option>
                            {groupOptions.map((group) => (
                              <option key={group.id} value={group.id}>
                                {group.name}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      )}

                      {/* Knockout Stage Selection */}
                      {editData.stageType === "KNOCKOUT_STAGE" && (
                        <Form.Group controlId="formStage" className="mb-3">
                          <Form.Label>Knockout Stage</Form.Label>
                          <Form.Control
                            as="select"
                            value={editData.selectedStage?.id || ""}
                            onChange={(e) => {
                              const stage = stageOptions.find(
                                (s) => s.id.toString() === e.target.value,
                              );
                              setEditData((prev) => ({
                                ...prev,
                                selectedStage: stage,
                              }));
                            }}
                            required
                          >
                            <option value="" disabled>
                              Select a stage
                            </option>
                            {stageOptions.map((stage) => (
                              <option key={stage.id} value={stage.id}>
                                {stage.name}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                      )}
                      <Form.Group controlId="formIsBetable" className="mb-3">
                        <Form.Label>Is Betable</Form.Label>
                        <Form.Control
                          as="select"
                          value={editData.isBetable} // Pobiera wartość ze stanu
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              isBetable: e.target.value === "true",
                            }))
                          }
                        >
                          <option value="false">False</option>
                          <option value="true">True</option>
                        </Form.Control>
                      </Form.Group>

                      {/* Match Statistics */}
                      {editData.status !== "UPCOMING" && (
                        <>
                          <Row>
                            <Col>
                              <Form.Group
                                controlId="formHomeGoals"
                                className="mb-3"
                              >
                                <Form.Label>Home Goals</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={editData.homeGoals}
                                  onChange={(e) =>
                                    setEditData((prev) => ({
                                      ...prev,
                                      homeGoals: parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  min="0"
                                  required
                                />
                              </Form.Group>
                              <Form.Group
                                controlId="formHomePossession"
                                className="mb-3"
                              >
                                <Form.Label>Home Possession (%)</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={editData.homePossession}
                                  onChange={(e) => {
                                    const homePossession =
                                      parseFloat(e.target.value) || 0;
                                    setEditData((prev) => ({
                                      ...prev,
                                      homePossession,
                                      awayPossession: 100 - homePossession,
                                    }));
                                  }}
                                  min="0"
                                  max="100"
                                  required
                                />
                              </Form.Group>
                              <Form.Group
                                controlId="formHomePasses"
                                className="mb-3"
                              >
                                <Form.Label>Home Passes</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={editData.homePasses}
                                  onChange={(e) =>
                                    setEditData((prev) => ({
                                      ...prev,
                                      homePasses: parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  min="0"
                                  required
                                />
                              </Form.Group>
                              <Form.Group
                                controlId="formHomeAccuratePasses"
                                className="mb-3"
                              >
                                <Form.Label>Home Accurate Passes</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={editData.homeAccuratePasses}
                                  onChange={(e) =>
                                    setEditData((prev) => ({
                                      ...prev,
                                      homeAccuratePasses:
                                        parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  min="0"
                                  max={editData.homePasses}
                                  required
                                />
                              </Form.Group>
                              <Form.Group
                                controlId="formHomeShots"
                                className="mb-3"
                              >
                                <Form.Label>Home Shots</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={editData.homeShots}
                                  onChange={(e) =>
                                    setEditData((prev) => ({
                                      ...prev,
                                      homeShots: parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  min="0"
                                  required
                                />
                              </Form.Group>
                              <Form.Group
                                controlId="formHomeShotsOnGoal"
                                className="mb-3"
                              >
                                <Form.Label>Home Shots on Goal</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={editData.homeShotsOnGoal}
                                  onChange={(e) =>
                                    setEditData((prev) => ({
                                      ...prev,
                                      homeShotsOnGoal:
                                        parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  min="0"
                                  max={editData.homeShots}
                                  required
                                />
                              </Form.Group>
                              <Form.Group
                                controlId="formHomeCorners"
                                className="mb-3"
                              >
                                <Form.Label>Home Corners</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={editData.homeCorners}
                                  onChange={(e) =>
                                    setEditData((prev) => ({
                                      ...prev,
                                      homeCorners:
                                        parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  min="0"
                                  required
                                />
                              </Form.Group>
                              <Form.Group
                                controlId="formHomeOffside"
                                className="mb-3"
                              >
                                <Form.Label>Home Offside</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={editData.homeOffside}
                                  onChange={(e) =>
                                    setEditData((prev) => ({
                                      ...prev,
                                      homeOffside:
                                        parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  min="0"
                                  required
                                />
                              </Form.Group>
                              <Form.Group
                                controlId="formHomeFouls"
                                className="mb-3"
                              >
                                <Form.Label>Home Fouls</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={editData.homeFouls}
                                  onChange={(e) =>
                                    setEditData((prev) => ({
                                      ...prev,
                                      homeFouls: parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  min="0"
                                  required
                                />
                              </Form.Group>
                            </Col>
                            <Col>
                              {/* Away Team Statistics */}

                              <Form.Group
                                controlId="formAwayGoals"
                                className="mb-3"
                              >
                                <Form.Label>Away Goals</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={editData.awayGoals}
                                  onChange={(e) =>
                                    setEditData((prev) => ({
                                      ...prev,
                                      awayGoals: parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  min="0"
                                  required
                                />
                              </Form.Group>

                              <Form.Group
                                controlId="formAwayPossession"
                                className="mb-3"
                              >
                                <Form.Label>Away Possession (%)</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={editData.awayPossession}
                                  onChange={(e) => {
                                    const awayPossession =
                                      parseFloat(e.target.value) || 0;
                                    setEditData((prev) => ({
                                      ...prev,
                                      awayPossession,
                                      homePossession: 100 - awayPossession,
                                    }));
                                  }}
                                  min="0"
                                  max="100"
                                  required
                                />
                              </Form.Group>
                              <Form.Group
                                controlId="formAwayPasses"
                                className="mb-3"
                              >
                                <Form.Label>Away Passes</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={editData.awayPasses}
                                  onChange={(e) =>
                                    setEditData((prev) => ({
                                      ...prev,
                                      awayPasses: parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  min="0"
                                  required
                                />
                              </Form.Group>
                              <Form.Group
                                controlId="formAwayAccuratePasses"
                                className="mb-3"
                              >
                                <Form.Label>Away Accurate Passes</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={editData.awayAccuratePasses}
                                  onChange={(e) =>
                                    setEditData((prev) => ({
                                      ...prev,
                                      awayAccuratePasses:
                                        parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  min="0"
                                  max={editData.awayPasses}
                                  required
                                />
                              </Form.Group>
                              <Form.Group
                                controlId="formAwayShots"
                                className="mb-3"
                              >
                                <Form.Label>Away Shots</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={editData.awayShots}
                                  onChange={(e) =>
                                    setEditData((prev) => ({
                                      ...prev,
                                      awayShots: parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  min="0"
                                  required
                                />
                              </Form.Group>
                              <Form.Group
                                controlId="formAwayShotsOnGoal"
                                className="mb-3"
                              >
                                <Form.Label>Away Shots on Goal</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={editData.awayShotsOnGoal}
                                  onChange={(e) =>
                                    setEditData((prev) => ({
                                      ...prev,
                                      awayShotsOnGoal:
                                        parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  min="0"
                                  max={editData.awayShots}
                                  required
                                />
                              </Form.Group>
                              <Form.Group
                                controlId="formAwayCorners"
                                className="mb-3"
                              >
                                <Form.Label>Away Corners</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={editData.awayCorners}
                                  onChange={(e) =>
                                    setEditData((prev) => ({
                                      ...prev,
                                      awayCorners:
                                        parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  min="0"
                                  required
                                />
                              </Form.Group>
                              <Form.Group
                                controlId="formAwayOffside"
                                className="mb-3"
                              >
                                <Form.Label>Away Offside</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={editData.awayOffside}
                                  onChange={(e) =>
                                    setEditData((prev) => ({
                                      ...prev,
                                      awayOffside:
                                        parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  min="0"
                                  required
                                />
                              </Form.Group>
                              <Form.Group
                                controlId="formAwayFouls"
                                className="mb-3"
                              >
                                <Form.Label>Away Fouls</Form.Label>
                                <Form.Control
                                  type="number"
                                  value={editData.awayFouls}
                                  onChange={(e) =>
                                    setEditData((prev) => ({
                                      ...prev,
                                      awayFouls: parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  min="0"
                                  required
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </>
                      )}
                      <Button variant="primary" type="submit" className="w-100">
                        Save Changes
                      </Button>
                      {teamError && (
                        <p style={{ color: "red", marginTop: "10px" }}>
                          {teamError}
                        </p>
                      )}
                    </Form>
                  </div>
                )}
              </React.Fragment>
            ))}
          </Container>
        </div>
      )}

      {noResultsMessage && (
        <p className="text-center text-muted">{noResultsMessage}</p>
      )}

      <PaginationComponent
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      <Modal
        show={showLeagueModal}
        onHide={() => setShowLeagueModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Select League</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Kraj */}
          {!selectedCountry && (
            <>
              <h5>Select Country</h5>
              <ListGroup>
                {countries.map((country) => (
                  <ListGroup.Item
                    key={country}
                    action
                    onClick={() => handleSelectCountry(country)}
                  >
                    {country}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}

          {/* Liga */}
          {selectedCountry && !selectedLeagueName && (
            <>
              <h5>Select League in {selectedCountry}</h5>
              <ListGroup>
                {leagues.map((league) => (
                  <ListGroup.Item
                    key={league.name}
                    action
                    onClick={() => handleSelectLeagueName(league.name)}
                  >
                    {league.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}

          {/* Edycja */}
          {selectedLeagueName && !selectedEdition && (
            <>
              <h5>Select Edition for {selectedLeagueName}</h5>
              <ListGroup>
                {editions.map((edition) => (
                  <ListGroup.Item
                    key={edition}
                    action
                    onClick={() => handleSelectEdition(edition)}
                  >
                    Edition: {edition}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MatchSearchAndEditForm;
