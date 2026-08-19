import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, ListGroup, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import TeamImageSmall from "./TeamImageSmall";

const BASE_URL = "http://localhost:8080";

const AddBetForm = () => {
  const [matchSearchQuery, setMatchSearchQuery] = useState("");
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [userId, setUserId] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

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

  const handleMatchSearch = (e) => {
    setMatchSearchQuery(e.target.value);
  };

  const handleMatchSelect = (match) => {
    setSelectedMatch(match);
    setMatchSearchQuery(`${match.homeTeam.name} vs ${match.awayTeam.name}`);
    setFilteredMatches([]);
  };

  useEffect(() => {
    if (matchSearchQuery) {
      const token = localStorage.getItem("jwtToken");
      axios
        .get(
          `http://localhost:8080/api/matches/search?query=${matchSearchQuery}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then((response) => setFilteredMatches(response.data))
        .catch((error) => console.error("Error fetching matches:", error));
    } else {
      setFilteredMatches([]);
    }
  }, [matchSearchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");
    if (!selectedMatch) {
      alert("Please select a match before placing a bet.");
      return;
    }

    const betData = {
      matchId: selectedMatch.id,
      userId: userId,
      homeScore,
      awayScore,
    };

    axios
      .post("http://localhost:8080/api/bets/add", betData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Bet placed successfully!");
        setSelectedMatch(null);
        setMatchSearchQuery("");
        setHomeScore("");
        setAwayScore("");
      })
      //        .catch((error) => console.error('Error placing bet:', error));
      .catch((error) => {
        if (error.response && error.response.data) {
          setAlertMessage(error.response.data);
        } else {
          setAlertMessage("An error occurred while adding bet");
        }
      });
  };

  return (
    <Container>
      <h1 className="mt-3">Place Bet</h1>
      {alertMessage && (
        <Alert
          variant="danger"
          onClose={() => setAlertMessage(null)}
          dismissible
        >
          {alertMessage}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Search for Match</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search match by team name"
            value={matchSearchQuery}
            onChange={handleMatchSearch}
          />
          {filteredMatches.length > 0 && (
            <ListGroup>
              {filteredMatches.map((match) => (
                <ListGroup.Item
                  key={match.id}
                  onClick={() => handleMatchSelect(match)}
                  style={{ cursor: "pointer" }}
                >
                  {match.homeTeam.name} vs {match.awayTeam.name} (
                  {match.dateTime})
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Form.Group>
        {selectedMatch && (
          <>
            <p></p>
            <h5>
              Selected Match: {selectedMatch.homeTeam.name} vs{" "}
              {selectedMatch.awayTeam.name}
            </h5>
            <p></p>
            <p>Date: {new Date(selectedMatch.dateTime).toLocaleString()}</p>
            <p>Stadium: {selectedMatch.stadium.name} </p>
            <p>
              Referee: {selectedMatch.referee.firstName}{" "}
              {selectedMatch.referee.lastName}
            </p>
            <Form.Group className="d-flex align-items-center justify-content-center">
              {/* Herb i nazwa drużyny domowej */}
              <div className="d-flex align-items-center">
                <TeamImageSmall team={selectedMatch.homeTeam} />
                <span className="ms-2">{selectedMatch.homeTeam.name}</span>
              </div>

              {/* Pola wyników */}
              <div className="d-flex align-items-center">
                <Form.Control
                  type="number"
                  value={homeScore}
                  onChange={(e) => setHomeScore(e.target.value)}
                  required
                  min="0"
                  style={{
                    width: "75px",
                    textAlign: "center",
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                />
                <span className="mx-2">:</span>
                <Form.Control
                  type="number"
                  value={awayScore}
                  onChange={(e) => setAwayScore(e.target.value)}
                  required
                  min="0"
                  style={{
                    width: "75px",
                    textAlign: "center",
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                />
              </div>

              {/* Herb i nazwa drużyny gości */}
              <div className="d-flex align-items-center">
                <span className="me-2">{selectedMatch.awayTeam.name}</span>
                <TeamImageSmall team={selectedMatch.awayTeam} />
              </div>
            </Form.Group>
          </>
        )}
        <Button type="submit" disabled={!selectedMatch} className="mt-3">
          Place Bet
        </Button>
      </Form>
      <p></p>
      <Link to="/ranking" className="btn btn-success btn-lg w-100 mt-3">
        Check The Rankings
      </Link>
    </Container>
  );
};

export default AddBetForm;
