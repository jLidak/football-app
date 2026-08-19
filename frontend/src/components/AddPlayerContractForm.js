import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, ListGroup, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const AddPlayerContractForm = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [salary, setSalary] = useState("");
  const [transferFee, setTransferFee] = useState("");
  const [transferType, setTransferType] = useState("");
  const [playerSearchQuery, setPlayerSearchQuery] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    if (playerSearchQuery) {
      if (
        selectedPlayer &&
        playerSearchQuery !==
          `${selectedPlayer.firstName} ${selectedPlayer.lastName}`
      ) {
        setSelectedPlayer(null);
      }

      const token = localStorage.getItem("jwtToken");
      axios
        .get(
          `http://localhost:8080/api/players/search?query=${playerSearchQuery}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then((response) => setFilteredPlayers(response.data))
        .catch((error) => console.error("Error fetching players:", error));
    } else {
      setFilteredPlayers([]);
      setSelectedPlayer(null);
    }
  }, [playerSearchQuery, selectedPlayer]);

  useEffect(() => {
    if (teamSearchQuery) {
      if (selectedTeam && teamSearchQuery !== selectedTeam.name) {
        setSelectedTeam(null);
      }

      const token = localStorage.getItem("jwtToken");
      axios
        .get(
          `http://localhost:8080/api/teams/search?query=${teamSearchQuery}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then((response) => setFilteredTeams(response.data))
        .catch((error) => console.error("Error fetching teams:", error));
    } else {
      setFilteredTeams([]);
      setSelectedTeam(null);
    }
  }, [teamSearchQuery, selectedTeam]);

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player);
    setPlayerSearchQuery(`${player.firstName} ${player.lastName}`);
    setFilteredPlayers([]);
  };

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
    setTeamSearchQuery(team.name);
    setFilteredTeams([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");
    const contractData = {
      startDate,
      endDate,
      salary: salary || null,
      transferFee: transferType === "TRANSFER" ? transferFee : null,
      transferType,
      playerId: selectedPlayer ? selectedPlayer.id : null,
      teamId: selectedTeam ? selectedTeam.id : null,
    };

    axios
      .post("http://localhost:8080/api/player-contracts/add", contractData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Player contract added successfully");
        resetForm();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setAlertMessage(error.response.data);
        } else {
          setAlertMessage("An error occurred while adding the contract");
        }
      });
  };

  const resetForm = () => {
    setStartDate("");
    setEndDate("");
    setSalary("");
    setTransferFee("");
    setTransferType("");
    setPlayerSearchQuery("");
    setFilteredPlayers([]);
    setSelectedPlayer(null);
    setTeamSearchQuery("");
    setFilteredTeams([]);
    setSelectedTeam(null);
    setAlertMessage(null);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Add Player Contract</h1>
      {alertMessage && (
        <Alert
          variant="danger"
          onClose={() => setAlertMessage(null)}
          dismissible
        >
          {alertMessage}
        </Alert>
      )}
      <Form
        onSubmit={handleSubmit}
        className="p-4 border rounded shadow-sm bg-light"
      >
        <Form.Group controlId="formPlayerSearch" className="mb-3">
          <Form.Label>Search Player</Form.Label>
          <Form.Control
            type="text"
            value={playerSearchQuery}
            onChange={(e) => setPlayerSearchQuery(e.target.value)}
            placeholder="Search for a player"
          />
          {filteredPlayers.length > 0 && !selectedPlayer && (
            <ListGroup className="mt-2">
              {filteredPlayers.map((player) => (
                <ListGroup.Item
                  key={player.id}
                  onClick={() => handlePlayerSelect(player)}
                  style={{ cursor: "pointer" }}
                >
                  {player.firstName} {player.lastName} ({player.nickname})
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Form.Group>

        <Form.Group controlId="formTeamSearch" className="mb-3">
          <Form.Label>Search Team</Form.Label>
          <Form.Control
            type="text"
            value={teamSearchQuery}
            onChange={(e) => setTeamSearchQuery(e.target.value)}
            placeholder="Search for a team"
          />
          {filteredTeams.length > 0 && !selectedTeam && (
            <ListGroup className="mt-2">
              {filteredTeams.map((team) => (
                <ListGroup.Item
                  key={team.id}
                  onClick={() => handleTeamSelect(team)}
                  style={{ cursor: "pointer" }}
                >
                  {team.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Form.Group>

        <Form.Group controlId="formStartDate" className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={getTodayDate()}
            required
          />
        </Form.Group>

        <Form.Group controlId="formEndDate" className="mb-3">
          <Form.Label>End Date (optional)</Form.Label>
          <Form.Control
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
          />
        </Form.Group>

        <Form.Group controlId="formSalary" className="mb-3">
          <Form.Label>Salary (optional)</Form.Label>
          <Form.Control
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            min="0"
          />
        </Form.Group>

        <Form.Group controlId="formTransferType" className="mb-3">
          <Form.Label>Transfer Type</Form.Label>
          <Form.Select
            value={transferType}
            onChange={(e) => setTransferType(e.target.value)}
            required
          >
            <option value="">Select Transfer Type</option>
            <option value="LOAN">Loan</option>
            <option value="TRANSFER">Transfer</option>
            <option value="END_LOAN">End of Loan</option>
          </Form.Select>
        </Form.Group>

        {transferType === "TRANSFER" && (
          <Form.Group controlId="formTransferFee" className="mb-3">
            <Form.Label>Transfer Fee</Form.Label>
            <Form.Control
              type="number"
              value={transferFee}
              onChange={(e) => setTransferFee(e.target.value)}
              min="0"
              required
            />
          </Form.Group>
        )}

        <Button variant="primary" type="submit" className="w-100">
          Add Contract
        </Button>
      </Form>
    </Container>
  );
};

export default AddPlayerContractForm;
