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
import "bootstrap/dist/css/bootstrap.min.css";

const EditMatchForm = ({ matchId }) => {
  const [dateTime, setDateTime] = useState("");
  const [matchStatus, setMatchStatus] = useState("UPCOMING");
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [selectedReferee, setSelectedReferee] = useState(null);
  const [selectedStadium, setSelectedStadium] = useState(null);

  const [stageType, setStageType] = useState("OTHER"); // Typ fazy: GROUP_STAGE, KNOCKOUT_STAGE, OTHER
  const [groupOptions, setGroupOptions] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [stageOptions, setStageOptions] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);

  // Modal-related states
  const [showLeagueModal, setShowLeagueModal] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeagueName, setSelectedLeagueName] = useState(null);
  const [editions, setEditions] = useState([]);
  const [selectedEdition, setSelectedEdition] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    axios
      .get(`http://localhost:8080/api/matches/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const match = response.data;
        setDateTime(match.dateTime);
        setMatchStatus(match.status);
        setSelectedReferee(match.referee);
        setSelectedStadium(match.stadium);
        setSelectedLeague(match.league);

        if (match.stage) {
          setSelectedStage(match.stage); // Ustaw `selectedStage` na podstawie danych meczu
        }

        if (match.stageType === "GROUP_STAGE") {
          setStageType("GROUP_STAGE");
          setSelectedGroup(match.group);
        } else if (match.stageType === "KNOCKOUT_STAGE") {
          setStageType("KNOCKOUT_STAGE");
        } else {
          setStageType("OTHER");
        }
      })
      .catch((error) => console.error("Error fetching match data:", error));
  }, [matchId]);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    // Pobierz dane meczu na podstawie matchId
    axios
      .get(`http://localhost:8080/api/matches/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const match = response.data;
        setDateTime(match.dateTime);
        setMatchStatus(match.status);
        setSelectedReferee(match.referee);
        setSelectedStadium(match.stadium);
        setSelectedLeague(match.league);

        if (match.stageType === "GROUP_STAGE") {
          setStageType("GROUP_STAGE");
          setSelectedGroup(match.group);
        } else if (match.stageType === "KNOCKOUT_STAGE") {
          setStageType("KNOCKOUT_STAGE");
          setSelectedStage(match.stage);
        } else {
          setStageType("OTHER");
        }
      })
      .catch((error) => console.error("Error fetching match data:", error));
  }, [matchId]);

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
        .then((response) => setGroupOptions(response.data))
        .catch((error) => console.error("Error fetching groups:", error));
    } else {
      setGroupOptions([]);
    }
  }, [stageType, selectedLeague]);

  useEffect(() => {
    if (stageType === "KNOCKOUT_STAGE") {
      const token = localStorage.getItem("jwtToken");
      axios
        .get("http://localhost:8080/api/leagueStages", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setStageOptions(response.data))
        .catch((error) => console.error("Error fetching stages:", error));
    } else {
      setStageOptions([]);
    }
  }, [stageType]);

  // Modal logic for league selection
  const handleOpenLeagueModal = () => {
    setSelectedCountry(null);
    setSelectedLeagueName(null);
    setSelectedEdition(null);
    setCountries([]);
    setLeagues([]);
    setEditions([]);

    const token = localStorage.getItem("jwtToken");
    axios
      .get("http://localhost:8080/api/leagues/countries", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setCountries(response.data))
      .catch((error) => console.error("Error fetching countries:", error));

    setShowLeagueModal(true);
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
      .then((response) => setLeagues(response.data))
      .catch((error) => console.error("Error fetching leagues:", error));
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
      .then((response) => setEditions(response.data))
      .catch((error) => console.error("Error fetching editions:", error));
  };

  const handleSelectEdition = (edition) => {
    setSelectedEdition(edition);

    const token = localStorage.getItem("jwtToken");
    axios
      .get(
        `http://localhost:8080/api/leagues/getByDetails?country=${selectedCountry}&name=${selectedLeagueName}&edition=${edition}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((response) => {
        setSelectedLeague(response.data);
        setShowLeagueModal(false);
      })
      .catch((error) => {
        console.error("Error fetching league by details:", error);
        alert("Failed to fetch league details");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    const matchData = {
      dateTime,
      status: matchStatus,
      referee: { id: selectedReferee?.id },
      stadium: { id: selectedStadium?.id },
      league: { id: selectedLeague?.id },
      ...(stageType === "GROUP_STAGE" && { group: selectedGroup }),
      ...(stageType === "KNOCKOUT_STAGE" && { stage: selectedStage }),
      ...(stageType === "OTHER" && { stage: { id: 11 } }), // Ustaw "OTHER" jako id 11
    };

    try {
      await axios.put(
        `http://localhost:8080/api/matches/${matchId}`,
        matchData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      alert("Match updated successfully");
    } catch (error) {
      console.error("Error updating match:", error);
      alert("Failed to update match");
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Edit Match</h1>
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
                const groupStage = stageOptions.find((stage) => stage.id === 1);
                if (groupStage) {
                  setSelectedStage(groupStage); // Ustaw fazę grupową
                } else {
                  console.error("Group stage not found in stageOptions");
                }
              } else if (selectedType === "OTHER") {
                const otherStage = stageOptions.find(
                  (stage) => stage.id === 11,
                );
                if (otherStage) {
                  setSelectedStage(otherStage); // Ustaw fazę "OTHER"
                } else {
                  setSelectedStage({ id: 11, name: "OTHER" }); // Domyślne ustawienie
                }
              } else {
                setSelectedStage(null); // Resetuj, jeśli brak typu fazy
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

        <Button variant="primary" type="submit" className="w-100 mt-3">
          Update Match
        </Button>
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

export default EditMatchForm;
