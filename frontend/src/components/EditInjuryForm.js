import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, ListGroup, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import UsePagination from "./UsePagination";
import PaginationComponent from "./PaginationComponent";

const EditInjuryForm = () => {
  const [playerSearchQuery, setPlayerSearchQuery] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [injuries, setInjuries] = useState([]);
  const [selectedInjury, setSelectedInjury] = useState(null);
  const [injuryType, setInjuryType] = useState("");
  const [injuryStartDate, setInjuryStartDate] = useState("");
  const [injuryEndDate, setInjuryEndDate] = useState("");
  const [noResultsMessage, setNoResultsMessage] = useState("");
  const [selectedPlayerMessage, setSelectedPlayerMessage] = useState("");

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    currentResults,
    handlePageChange,
  } = UsePagination(injuries, 20);

  const resetForm = () => {
    setInjuryType("");
    setInjuryStartDate("");
    setInjuryEndDate("");
    setSelectedInjury(null);
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (playerSearchQuery) {
      if (
        selectedPlayer &&
        playerSearchQuery !==
          `${selectedPlayer.firstName} ${selectedPlayer.lastName}`
      ) {
        setSelectedPlayer("");
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
      setInjuries([]);
      setNoResultsMessage("");
      setSelectedPlayerMessage("");
    }
  }, [playerSearchQuery, selectedPlayer]);

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player);
    setPlayerSearchQuery(`${player.firstName} ${player.lastName}`);
    setFilteredPlayers([]);
    setSelectedPlayerMessage(
      `Injuries of ${player.firstName} ${player.lastName}:`,
    );

    const token = localStorage.getItem("jwtToken");
    axios
      .get(`http://localhost:8080/api/injuries/player/${player.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setInjuries(response.data);
        setCurrentPage(1);
        setNoResultsMessage(
          response.data.length === 0 ? "No results found." : "",
        );
      })
      .catch((error) => {
        console.error("Error fetching injuries:", error);
        setNoResultsMessage("Error fetching injuries.");
      });
  };

  const handleInjurySelect = (injury) => {
    setSelectedInjury(injury.id);
    setInjuryType(injury.type);
    setInjuryStartDate(injury.startDate);
    setInjuryEndDate(injury.endDate);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    if (!token || selectedInjury === null) {
      console.error("Authorization token or injury not selected");
      return;
    }

    const injuryData = {
      playerId: selectedPlayer.id,
      type: injuryType,
      startDate: injuryStartDate,
      endDate: injuryEndDate,
    };

    axios
      .put(`http://localhost:8080/api/injuries/${selectedInjury}`, injuryData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Injury updated successfully");
        resetForm();
      })
      .catch((error) => console.error("Error updating injury:", error));
  };

  const handleDelete = (injuryId) => {
    const token = localStorage.getItem("jwtToken");

    axios
      .delete(`http://localhost:8080/api/injuries/${injuryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Injury deleted successfully");
        setInjuries(injuries.filter((injury) => injury.id !== injuryId)); // Update the list after deletion
      })
      .catch((error) => {
        console.error("Error deleting injury:", error);
        alert("Failed to delete injury");
      });
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Edit Injury</h1>

      <Form className="mb-4" onSubmit={(e) => e.preventDefault()}>
        <Form.Group className="mb-3">
          <Form.Label>Search for a player</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter player name"
            value={playerSearchQuery}
            onChange={(e) => setPlayerSearchQuery(e.target.value)}
          />
        </Form.Group>

        {filteredPlayers.length > 0 && !selectedPlayer && (
          <ListGroup className="mb-3">
            {filteredPlayers.map((player) => (
              <ListGroup.Item
                key={player.id}
                onClick={() => handlePlayerSelect(player)}
                style={{ cursor: "pointer" }}
              >
                {player.firstName} {player.lastName}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Form>

      {selectedPlayer && (
        <div className="mb-4">
          <p
            className="text-center"
            style={{ fontSize: "20px", fontWeight: "bold" }}
          >
            {selectedPlayerMessage}
          </p>
          <Container>
            {currentResults.length > 0 &&
              currentResults.map((injury) => (
                <React.Fragment key={injury.id}>
                  <Card className="mb-3 shadow-sm">
                    <Card.Body
                      className="d-flex justify-content-between align-items-center"
                      style={{ textAlign: "left" }}
                    >
                      <div>
                        <strong>ID:</strong> {injury.id}
                        <br />
                        <strong>Type:</strong> {injury.type}
                        <br />
                        <strong>Start Date:</strong> {injury.startDate}
                        <br />
                        <strong>End Date:</strong> {injury.endDate || "Present"}
                      </div>
                      <div>
                        <Button
                          variant="outline-primary"
                          onClick={() => handleInjurySelect(injury)}
                          className="me-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => handleDelete(injury.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>

                  {selectedInjury === injury.id && (
                    <div className="p-4 border rounded shadow-sm bg-light mb-3">
                      <h3 className="text-center mb-4">Edit Injury</h3>
                      <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formInjuryType" className="mb-3">
                          <Form.Label>Injury Type</Form.Label>
                          <Form.Control
                            type="text"
                            value={injuryType}
                            onChange={(e) => setInjuryType(e.target.value)}
                            required
                          />
                        </Form.Group>
                        <Form.Group
                          controlId="formInjuryStartDate"
                          className="mb-3"
                        >
                          <Form.Label>Start Date</Form.Label>
                          <Form.Control
                            type="date"
                            max={getTodayDate()}
                            value={injuryStartDate}
                            onChange={(e) => setInjuryStartDate(e.target.value)}
                            required
                          />
                        </Form.Group>
                        <Form.Group
                          controlId="formInjuryEndDate"
                          className="mb-3"
                        >
                          <Form.Label>End Date</Form.Label>
                          <Form.Control
                            type="date"
                            min={injuryStartDate}
                            value={injuryEndDate}
                            onChange={(e) => setInjuryEndDate(e.target.value)}
                          />
                        </Form.Group>
                        <Button
                          variant="primary"
                          type="submit"
                          className="w-100"
                        >
                          Save Changes
                        </Button>
                      </Form>
                    </div>
                  )}
                </React.Fragment>
              ))}
          </Container>

          {noResultsMessage && (
            <p className="text-center text-muted">{noResultsMessage}</p>
          )}

          <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </Container>
  );
};

export default EditInjuryForm;
