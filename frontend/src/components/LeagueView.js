import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, ListGroup, Button } from "react-bootstrap";
import TeamImageVerySmall from "./TeamImageVerySmall";

const BASE_URL = "http://localhost:8080";

const LeagueView = ({ leagueId, onBack }) => {
  const [league, setLeague] = useState(null);
  const [matches, setMatches] = useState([]);
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchLeagueData = async () => {
      try {
        const leagueResponse = await axios.get(
          `${BASE_URL}/api/leagues/${leagueId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setLeague(leagueResponse.data);

        const matchesResponse = await axios.get(
          `${BASE_URL}/api/matches/league/${leagueId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setMatches(
          matchesResponse.data.sort(
            (a, b) => new Date(a.dateTime) - new Date(b.dateTime),
          ),
        );
      } catch (error) {
        console.error("Error fetching league data:", error);
      }
    };

    fetchLeagueData();
  }, [leagueId, token]);

  if (!league) return <p>Ładowanie...</p>;

  return (
    <Container>
      <Button variant="outline-secondary" onClick={onBack} className="mb-3">
        Powrót
      </Button>
      <Card className="mb-4">
        <Card.Header>
          <h3>{league.name}</h3>
        </Card.Header>
        <Card.Body>
          <p>Kraj: {league.country?.name}</p>
        </Card.Body>
      </Card>
      <h5>Mecze:</h5>
      <ListGroup>
        {matches.map((match) => (
          <ListGroup.Item
            key={match.id}
            className="d-flex align-items-center justify-content-between"
          >
            <div>
              <TeamImageVerySmall team={match.homeTeam} />
              <span className="mx-2">{match.homeTeam.name}</span> vs{" "}
              <span className="mx-2">{match.awayTeam.name}</span>
              <TeamImageVerySmall team={match.awayTeam} />
            </div>
            <div>
              {new Date(match.dateTime).toLocaleDateString()} -{" "}
              {new Date(match.dateTime).toLocaleTimeString()}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default LeagueView;
