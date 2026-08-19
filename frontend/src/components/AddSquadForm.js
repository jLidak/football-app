import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Button, ListGroup } from "react-bootstrap";

const AddSquadForm = ({ matchId, onBack }) => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [isHomeTeam, setIsHomeTeam] = useState(true);

  useEffect(() => {
    // Fetch all players
    axios
      .get("http://localhost:8080/api/players", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })
      .then((response) => {
        setPlayers(response.data);
      })
      .catch((error) => console.error("Error fetching players:", error));
  }, []);

  const handleAddSquad = async () => {
    try {
      const squadData = selectedPlayers.map((player) => ({
        playerId: player.id,
        matchId: matchId,
        homeTeam: isHomeTeam,
        firstSquad: true, // Example field
      }));

      await axios.post(
        "http://localhost:8080/api/match-squad/add-bulk",
        squadData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        },
      );

      alert("Squad added successfully!");
      onBack(); // Navigate back
    } catch (error) {
      console.error("Error adding squad:", error);
      alert("Failed to add squad");
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center">Add Squad for Match {matchId}</h1>
      <Form.Group controlId="formHomeTeamToggle" className="mb-3">
        <Form.Check
          type="switch"
          label="Home Team"
          checked={isHomeTeam}
          onChange={(e) => setIsHomeTeam(e.target.checked)}
        />
      </Form.Group>
      <ListGroup>
        {players.map((player) => (
          <ListGroup.Item
            key={player.id}
            onClick={() => {
              if (!selectedPlayers.includes(player)) {
                setSelectedPlayers([...selectedPlayers, player]);
              } else {
                setSelectedPlayers(
                  selectedPlayers.filter((p) => p.id !== player.id),
                );
              }
            }}
            active={selectedPlayers.includes(player)}
          >
            {player.firstName} {player.lastName}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Button variant="primary" className="mt-3" onClick={handleAddSquad}>
        Add Squad
      </Button>
      <Button variant="secondary" className="mt-3" onClick={onBack}>
        Back to Matches
      </Button>
    </Container>
  );
};

export default AddSquadForm;
