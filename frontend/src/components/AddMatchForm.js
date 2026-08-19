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
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AddMatchForm = () => {
  const navigate = useNavigate();

  const [dateTime, setDateTime] = useState("");
  const [homeTeamSearchQuery, setHomeTeamSearchQuery] = useState("");
  const [awayTeamSearchQuery, setAwayTeamSearchQuery] = useState("");
  const [refereeSearchQuery, setRefereeSearchQuery] = useState("");
  const [stadiumSearchQuery, setStadiumSearchQuery] = useState("");
  const [leagueSearchQuery, setLeagueSearchQuery] = useState("");

  const [filteredHomeTeams, setFilteredHomeTeams] = useState([]);
  const [filteredAwayTeams, setFilteredAwayTeams] = useState([]);
  const [filteredReferees, setFilteredReferees] = useState([]);
  const [filteredStadiums, setFilteredStadiums] = useState([]);
  const [filteredLeagues, setFilteredLeagues] = useState([]);

  const [selectedHomeTeam, setSelectedHomeTeam] = useState(null);
  const [selectedAwayTeam, setSelectedAwayTeam] = useState(null);
  const [selectedReferee, setSelectedReferee] = useState(null);
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [showLeagueModal, setShowLeagueModal] = useState(false);

  const [round, setRound] = useState("");
  const [isBetable, setIsBetable] = useState(false);

  const [duration, setDuration] = useState(0);
  const [matchStatus, setMatchStatus] = useState("UPCOMING");
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

  const [showModal, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);
  const [teamError, setTeamError] = useState("");
  const [newMatchId, setNewMatchId] = useState(null);

  const [stageType, setStageType] = useState("OTHER"); // Typ fazy: GROUP_STAGE, KNOCKOUT_STAGE, OTHER
  const [groupOptions, setGroupOptions] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [stageOptions, setStageOptions] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);

  // Modal-related states
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeagueName, setSelectedLeagueName] = useState(null);
  const [editions, setEditions] = useState([]);
  const [selectedEdition, setSelectedEdition] = useState(null);

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

  // Fetch leagues for a selected country
  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setSelectedLeagueName(null);
    setSelectedEdition(null);

    const token = localStorage.getItem("jwtToken"); // Pobierz token JWT z localStorage

    axios
      .get(`http://localhost:8080/api/leagues/byCountry?country=${country}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Dodaj token do nagłówka
        },
      })
      .then((response) => {
        // Usuń duplikaty lig po nazwie
        const uniqueLeagues = response.data.filter(
          (league, index, self) =>
            index === self.findIndex((l) => l.name === league.name),
        );
        setLeagues(uniqueLeagues);
      })
      .catch((error) => console.error("Error fetching leagues:", error));
  };

  const handleSelectLeagueName = (leagueName) => {
    setSelectedLeagueName(leagueName);
    setSelectedEdition(null);

    const token = localStorage.getItem("jwtToken"); // Pobierz token JWT z localStorage

    axios
      .get(
        `http://localhost:8080/api/leagues/editions?leagueName=${leagueName}&country=${selectedCountry}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Dodaj token do nagłówków
          },
        },
      )
      .then((response) => setEditions(response.data))
      .catch((error) => console.error("Error fetching editions:", error));
  };

  // Finalize league selection
  const handleSelectEdition = (edition) => {
    setSelectedEdition(edition);

    const token = localStorage.getItem("jwtToken");

    // Pobierz pełny obiekt ligi z bazy
    axios
      .get(
        `http://localhost:8080/api/leagues/getByDetails?country=${selectedCountry}&name=${selectedLeagueName}&edition=${edition}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((response) => {
        setSelectedLeague(response.data); // Ustaw pełny obiekt ligi
        setShowLeagueModal(false); // Zamknij modal
      })
      .catch((error) => {
        console.error("Error fetching league by details:", error);
        alert("Failed to fetch league details");
      });
  };

  const resetForm = () => {
    setMatchStatus("UPCOMING");
    setDateTime("");
    setRound("");
    setHomeTeamSearchQuery("");
    setAwayTeamSearchQuery("");
    setRefereeSearchQuery("");
    setStadiumSearchQuery("");
    setLeagueSearchQuery("");

    setHomeGoals(0);
    setAwayGoals(0);
    setHomePossession(0);
    setAwayPossession(0);
    setHomePasses(0);
    setAwayPasses(0);
    setHomeAccuratePasses(0);
    setAwayAccuratePasses(0);
    setHomeShots(0);
    setAwayShots(0);
    setHomeShotsOnGoal(0);
    setAwayShotsOnGoal(0);
    setHomeCorners(0);
    setAwayCorners(0);
    setHomeOffside(0);
    setAwayOffside(0);
    setHomeFouls(0);
    setAwayFouls(0);
  };

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
      setSelectedHomeTeam(null);
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

  // useEffect(() => {
  //     if (newMatchId) {
  //         console.log("newMatchId has been set:", newMatchId);
  //         setShowModal(true); // Open the modal once `newMatchId` is set
  //     }
  // }, [newMatchId]);

  // Pobieranie grup dla fazy grupowej
  useEffect(() => {
    if (stageType === "GROUP_STAGE" && selectedLeague) {
      const token = localStorage.getItem("jwtToken");
      axios
        .get(
          `http://localhost:8080/api/leagueGroups/league/${selectedLeague.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then((response) => {
          setGroupOptions(response.data);
          console.log("Group options:", response.data);
          if (response.data.length > 0) {
            setSelectedGroup(response.data[0]); // Automatyczny wybór pierwszej grupy
          }
        })
        .catch((error) => console.error("Error fetching groups:", error));
    } else {
      setGroupOptions([]);
    }
  }, [stageType, selectedLeague]);

  // Pobieranie nazw faz pucharowych
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    axios
      .get("http://localhost:8080/api/leagueStages", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setStageOptions(response.data))
      .catch((error) => console.error("Error fetching stages:", error));
  }, [stageType]);

  const handleLeagueSelect = (league) => {
    setSelectedLeague(league);
    // Ustaw tylko nazwę ligi w polu wyszukiwania
    setLeagueSearchQuery(league.name);
    setFilteredLeagues([]);

    // Resetuj fazy i grupy
    setStageType("OTHER");
    setGroupOptions([]);
    setSelectedGroup(null);
    setStageOptions([]);
    setSelectedStage(null);
  };

  const handleRefereeSelect = (referee) => {
    setSelectedReferee(referee);
    setRefereeSearchQuery(`${referee.firstName} ${referee.lastName}`);
    setFilteredReferees([]);
  };
  const handleStadiumSelect = (stadium) => {
    setSelectedStadium(stadium);
    setStadiumSearchQuery(stadium.name);
    setFilteredStadiums([]);
  };
  const handleHomeTeamSelect = (team) => {
    setSelectedHomeTeam(team);
    setHomeTeamSearchQuery(team.name);
    setFilteredHomeTeams([]);
  };
  const handleAwayTeamSelect = (team) => {
    setSelectedAwayTeam(team);
    setAwayTeamSearchQuery(team.name);
    setFilteredAwayTeams([]);
  };

  const handleSubmit = async (e) => {
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

    const token = localStorage.getItem("jwtToken");

    // Zbuduj obiekt danych meczu
    const matchData = {
      dateTime,
      referee: { id: selectedReferee?.id }, // Sprawdzenie, czy referee został wybrany
      stadium: { id: selectedStadium?.id }, // Sprawdzenie, czy stadium został wybrany
      league: { id: selectedLeague?.id }, // Dodanie ID ligi
      homeTeam: { id: selectedHomeTeam?.id }, // Sprawdzenie, czy homeTeam został wybrany
      awayTeam: { id: selectedAwayTeam?.id }, // Sprawdzenie, czy awayTeam został wybrany
      round,
      isBetable,
      duration: 90,
      status: matchStatus,

      // Statystyki, dodawane tylko dla statusów innych niż "UPCOMING"
      ...(matchStatus !== "UPCOMING" && {
        homeGoals,
        awayGoals,
        homePossession,
        awayPossession,
        homePasses,
        awayPasses,
        homeAccuratePasses,
        awayAccuratePasses,
        homeShots,
        awayShots,
        homeShotsOnGoal,
        awayShotsOnGoal,
        homeCorners,
        awayCorners,
        homeOffside,
        awayOffside,
        homeFouls,
        awayFouls,
      }),
      // Dane fazy grupowej
      ...(stageType === "GROUP_STAGE" && {
        stage: selectedStage,
        group: { id: selectedGroup?.id },
      }),
      // Dane fazy pucharowej
      ...(stageType === "KNOCKOUT_STAGE" && { stage: selectedStage }),
      ...(stageType === "OTHER" && { stage: { id: 11 } }), // Ustaw "OTHER" jako id 11
    };

    console.log("Wysyłane dane meczu:", JSON.stringify(matchData, null, 2));

    try {
      const response = await axios.post(
        "http://localhost:8080/api/matches/add",
        matchData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      console.log("Odpowiedź backendu:", response.data);

      setNewMatchId(response.data); // Zapisz ID nowego meczu
      handleModalShow(); // Otwórz modal po dodaniu meczu
      resetForm(); // Zresetuj formularz
    } catch (error) {
      console.error("Błąd podczas dodawania meczu:", error);
      alert("Failed to add match");
    }
  };
  const handleAddMatchSquad = () => {
    console.log("New match ID before navigation:", newMatchId);
    handleModalClose();
    if (newMatchId) {
      navigate(`/add-match-squad/${newMatchId}`);
    } else {
      alert("Match ID is missing!");
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Add Match</h1>
      <Form
        onSubmit={handleSubmit}
        className="p-4 border rounded shadow-sm bg-light"
      >
        <Form.Group controlId="formMatchStatus" className="mb-3">
          <Form.Label>Match Status</Form.Label>
          <Form.Control
            as="select"
            value={matchStatus}
            onChange={(e) => setMatchStatus(e.target.value)}
            required
          >
            <option value="UPCOMING">UPCOMING</option>
            <option value="IN_PLAY">IN_PLAY</option>
            <option value="FINISHED">FINISHED</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formDateTime" className="mb-3">
          <Form.Label>Date and Time</Form.Label>
          <Form.Control
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formRound" className="mb-3">
          <Form.Label>Round</Form.Label>
          <Form.Control
            type="text"
            value={round}
            onChange={(e) => setRound(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formHomeTeam" className="mb-3">
          <Form.Label>Home Team</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search for a home team"
            value={homeTeamSearchQuery}
            onChange={(e) => setHomeTeamSearchQuery(e.target.value)}
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
            onChange={(e) => setAwayTeamSearchQuery(e.target.value)}
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
            onChange={(e) => setRefereeSearchQuery(e.target.value)}
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
            onChange={(e) => setStadiumSearchQuery(e.target.value)}
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

        <Form.Group controlId="formStageType" className="mb-3">
          <Form.Label>Stage Type</Form.Label>
          <Form.Control
            as="select"
            value={stageType}
            onChange={(e) => {
              const selectedType = e.target.value;
              setStageType(selectedType);

              if (selectedType === "GROUP_STAGE") {
                // Znajdź obiekt GROUP w stageOptions
                const groupStage = stageOptions.find((stage) => stage.id === 1);
                if (groupStage) {
                  setSelectedStage(groupStage); // Ustaw GROUP jako selectedStage
                } else {
                  console.error("Group stage not found in stageOptions");
                }
              } else if (selectedType === "OTHER") {
                // Znajdź obiekt OTHER w stageOptions
                const otherStage = stageOptions.find(
                  (stage) => stage.id === 11,
                );
                if (otherStage) {
                  setSelectedStage(otherStage); // Ustaw OTHER jako selectedStage
                } else {
                  console.error("Other stage not found in stageOptions");
                }
              } else {
                setSelectedStage(null); // Resetuj stage, jeśli wybrano inny typ
              }
            }}
            required
          >
            <option value="OTHER">Other</option>
            <option value="GROUP_STAGE">Group Stage</option>
            <option value="KNOCKOUT_STAGE">Knockout Stage</option>
          </Form.Control>
        </Form.Group>

        {stageType === "GROUP_STAGE" && (
          <Form.Group controlId="formGroup" className="mb-3">
            <Form.Label>Group</Form.Label>
            <Form.Control
              as="select"
              value={selectedGroup?.id || ""}
              onChange={(e) => {
                const group = groupOptions.find(
                  (g) => g.id.toString() === e.target.value,
                );
                setSelectedGroup(group);
              }}
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

        {stageType === "KNOCKOUT_STAGE" && (
          <Form.Group controlId="formStage" className="mb-3">
            <Form.Label>Knockout Stage</Form.Label>
            <Form.Control
              as="select"
              value={selectedStage?.id || ""}
              onChange={(e) => {
                const stage = stageOptions.find(
                  (s) => s.id.toString() === e.target.value,
                );
                setSelectedStage(stage);
              }}
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
            value={isBetable} // Domyślnie false
            onChange={(e) => setIsBetable(e.target.value === "true")}
          >
            <option value="false">False</option>
            <option value="true">True</option>
          </Form.Control>
        </Form.Group>

        {matchStatus !== "UPCOMING" && (
          <>
            <Row>
              <Col>
                <Form.Group controlId="formHomeGoals" className="mb-3">
                  <Form.Label>Home Team Goals</Form.Label>
                  <Form.Control
                    type="number"
                    value={homeGoals}
                    onChange={(e) => setHomeGoals(parseInt(e.target.value))}
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formAwayGoals" className="mb-3">
                  <Form.Label>Away Team Goals</Form.Label>
                  <Form.Control
                    type="number"
                    value={awayGoals}
                    onChange={(e) => setAwayGoals(parseInt(e.target.value))}
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <h5 className="text-center">Home</h5>
                <Form.Group controlId="formHomePossession" className="mb-3">
                  <Form.Label>Home Possession (%)</Form.Label>
                  <Form.Control
                    type="number"
                    value={homePossession}
                    onChange={(e) => {
                      const newHomePossession = parseFloat(e.target.value);
                      setHomePossession(newHomePossession);
                      setAwayPossession(100 - newHomePossession);
                    }}
                    min="0"
                    max="100"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formHomePasses" className="mb-3">
                  <Form.Label>Home Passes</Form.Label>
                  <Form.Control
                    type="number"
                    value={homePasses}
                    onChange={(e) => setHomePasses(parseInt(e.target.value))}
                    min="0"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formHomeAccuratePasses" className="mb-3">
                  <Form.Label>Home Accurate Passes</Form.Label>
                  <Form.Control
                    type="number"
                    value={homeAccuratePasses}
                    onChange={(e) =>
                      setHomeAccuratePasses(parseInt(e.target.value))
                    }
                    min="0"
                    max={homePasses}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formHomeShots" className="mb-3">
                  <Form.Label>Home Shots</Form.Label>
                  <Form.Control
                    type="number"
                    value={homeShots}
                    onChange={(e) => setHomeShots(parseInt(e.target.value))}
                    min="0"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formHomeShotsOnGoal" className="mb-3">
                  <Form.Label>Home Shots on Goal</Form.Label>
                  <Form.Control
                    type="number"
                    value={homeShotsOnGoal}
                    onChange={(e) =>
                      setHomeShotsOnGoal(parseInt(e.target.value))
                    }
                    min="0"
                    max={homeShots}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formHomeCorners" className="mb-3">
                  <Form.Label>Home Corners</Form.Label>
                  <Form.Control
                    type="number"
                    value={homeCorners}
                    onChange={(e) => setHomeCorners(parseInt(e.target.value))}
                    min="0"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formHomeOffside" className="mb-3">
                  <Form.Label>Home Offside</Form.Label>
                  <Form.Control
                    type="number"
                    value={homeOffside}
                    onChange={(e) => setHomeOffside(parseInt(e.target.value))}
                    min="0"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formHomeFouls" className="mb-3">
                  <Form.Label>Home Fouls</Form.Label>
                  <Form.Control
                    type="number"
                    value={homeFouls}
                    onChange={(e) => setHomeFouls(parseInt(e.target.value))}
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <h5 className="text-center">Away</h5>
                <Form.Group controlId="formAwayPossession" className="mb-3">
                  <Form.Label>Away Possession (%)</Form.Label>
                  <Form.Control
                    type="number"
                    value={awayPossession}
                    onChange={(e) => {
                      const newAwayPossession = parseFloat(e.target.value);
                      setAwayPossession(newAwayPossession);
                      setHomePossession(100 - newAwayPossession);
                    }}
                    min="0"
                    max="100"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formAwayPasses" className="mb-3">
                  <Form.Label>Away Passes</Form.Label>
                  <Form.Control
                    type="number"
                    value={awayPasses}
                    onChange={(e) => setAwayPasses(parseInt(e.target.value))}
                    min="0"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formAwayAccuratePasses" className="mb-3">
                  <Form.Label>Away Accurate Passes</Form.Label>
                  <Form.Control
                    type="number"
                    value={awayAccuratePasses}
                    onChange={(e) =>
                      setAwayAccuratePasses(parseInt(e.target.value))
                    }
                    min="0"
                    max={awayPasses}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formAwayShots" className="mb-3">
                  <Form.Label>Away Shots</Form.Label>
                  <Form.Control
                    type="number"
                    value={awayShots}
                    onChange={(e) => setAwayShots(parseInt(e.target.value))}
                    min="0"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formAwayShotsOnGoal" className="mb-3">
                  <Form.Label>Away Shots on Goal</Form.Label>
                  <Form.Control
                    type="number"
                    value={awayShotsOnGoal}
                    onChange={(e) =>
                      setAwayShotsOnGoal(parseInt(e.target.value))
                    }
                    min="0"
                    max={awayShots}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formAwayCorners" className="mb-3">
                  <Form.Label>Away Corners</Form.Label>
                  <Form.Control
                    type="number"
                    value={awayCorners}
                    onChange={(e) => setAwayCorners(parseInt(e.target.value))}
                    min="0"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formAwayOffside" className="mb-3">
                  <Form.Label>Away Offside</Form.Label>
                  <Form.Control
                    type="number"
                    value={awayOffside}
                    onChange={(e) => setAwayOffside(parseInt(e.target.value))}
                    min="0"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formAwayFouls" className="mb-3">
                  <Form.Label>Away Fouls</Form.Label>
                  <Form.Control
                    type="number"
                    value={awayFouls}
                    onChange={(e) => setAwayFouls(parseInt(e.target.value))}
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        )}

        <Button variant="primary" type="submit" className="w-100 mt-3">
          Add Match
        </Button>

        {teamError && (
          <p style={{ color: "red", marginTop: "10px" }}>{teamError}</p>
        )}
      </Form>

      {/* League Selection Modal */}
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
          {/* Country Selection */}
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

          {/* League Name Selection */}
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

          {/* Edition Selection */}
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

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Match Added</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to add a squad for this match?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            No
          </Button>
          <Button variant="primary" onClick={handleAddMatchSquad}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AddMatchForm;
