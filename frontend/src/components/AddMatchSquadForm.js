import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, ListGroup } from "react-bootstrap";
import { useParams } from "react-router-dom";

const AddMatchSquadForm = () => {
  const { matchId } = useParams();
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const [selectedHomePlayers, setSelectedHomePlayers] = useState([]);
  const [selectedAwayPlayers, setSelectedAwayPlayers] = useState([]);
  const [firstSquadHome, setFirstSquadHome] = useState({});
  const [firstSquadAway, setFirstSquadAway] = useState({});
  const [homeTeamId, setHomeTeamId] = useState(null);
  const [awayTeamId, setAwayTeamId] = useState(null);

  useEffect(() => {
    console.log("matchId:", matchId);
  }, [matchId]);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(
          `http://localhost:8080/api/matches/${matchId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const { homeTeam, awayTeam } = response.data;

        setHomeTeamId(homeTeam.id);
        setAwayTeamId(awayTeam.id);
      } catch (error) {
        console.error("Error fetching match details:", error);
      }
    };

    fetchMatchDetails();
  }, [matchId]);

  useEffect(() => {
    const fetchPlayers = async (teamId, setter) => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(
          `http://localhost:8080/api/players/by-team/${teamId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setter(response.data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    if (homeTeamId) {
      fetchPlayers(homeTeamId, setHomePlayers);
    }
    if (awayTeamId) {
      fetchPlayers(awayTeamId, setAwayPlayers);
    }
  }, [homeTeamId, awayTeamId]);

  const handlePlayerSelection = (player, isHomeTeam) => {
    const updateSelection = (currentSelection, setSelection) => {
      const isSelected = currentSelection.some((p) => p.id === player.id);
      if (isSelected) {
        setSelection(currentSelection.filter((p) => p.id !== player.id));
      } else {
        setSelection([...currentSelection, player]);
      }
    };

    if (isHomeTeam) {
      updateSelection(selectedHomePlayers, setSelectedHomePlayers);
    } else {
      updateSelection(selectedAwayPlayers, setSelectedAwayPlayers);
    }
  };

  const handleFirstSquadChange = (playerId, isChecked, isHomeTeam) => {
    if (isHomeTeam) {
      setFirstSquadHome((prev) => ({ ...prev, [playerId]: isChecked }));
    } else {
      setFirstSquadAway((prev) => ({ ...prev, [playerId]: isChecked }));
    }
  };

  const handleSaveSquad = async () => {
    const token = localStorage.getItem("jwtToken");

    const saveSquad = async (players, firstSquad, isHomeTeam) => {
      for (const player of players) {
        const squadObject = {
          matchId,
          playerId: player.id,
          isHomeTeam,
          firstSquad: firstSquad[player.id] || false,
        };
        console.log("Sending squad object:", squadObject); // Logowanie obiektu wysyłanego na backend

        try {
          await axios.post(
            "http://localhost:8080/api/match-squad/add",
            squadObject,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
        } catch (error) {
          console.error("Error saving squad:", error);
        }
      }
    };

    await saveSquad(selectedHomePlayers, firstSquadHome, true);
    await saveSquad(selectedAwayPlayers, firstSquadAway, false);
    alert("Squads saved successfully");
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Add Match Squad</h1>
      <Row>
        <Col>
          <h5>Home Team</h5>
          <ListGroup>
            {homePlayers.map((player) => (
              <ListGroup.Item
                key={player.id}
                action
                onClick={() => handlePlayerSelection(player, true)}
                active={selectedHomePlayers.some((p) => p.id === player.id)}
              >
                <Row>
                  <Col>
                    {player.firstName} {player.lastName}
                  </Col>
                  <Col>
                    <Form.Check
                      type="checkbox"
                      label="First Squad"
                      checked={firstSquadHome[player.id] || false}
                      onChange={(e) =>
                        handleFirstSquadChange(
                          player.id,
                          e.target.checked,
                          true,
                        )
                      }
                    />
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col>
          <h5>Away Team</h5>
          <ListGroup>
            {awayPlayers.map((player) => (
              <ListGroup.Item
                key={player.id}
                action
                onClick={() => handlePlayerSelection(player, false)}
                active={selectedAwayPlayers.some((p) => p.id === player.id)}
              >
                <Row>
                  <Col>
                    {player.firstName} {player.lastName}
                  </Col>
                  <Col>
                    <Form.Check
                      type="checkbox"
                      label="First Squad"
                      checked={firstSquadAway[player.id] || false}
                      onChange={(e) =>
                        handleFirstSquadChange(
                          player.id,
                          e.target.checked,
                          false,
                        )
                      }
                    />
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
      <Button variant="primary" className="mt-3" onClick={handleSaveSquad}>
        Save Squad
      </Button>
    </Container>
  );
};

export default AddMatchSquadForm;
