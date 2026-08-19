import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Nav, Table } from "react-bootstrap";
import Sidebar from "./Sidebar";
import UsePagination from "./UsePagination";
import PaginationComponent from "./PaginationComponent";
import TeamImage from "./TeamImage";
import PlayerImageVerySmall from "./PlayerImageVerySmall";

const BASE_URL = "http://localhost:8080";

const TeamPage = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [recentMatches, setRecentMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [activePlayers, setActivePlayers] = useState([]);
  const [activeTab, setActiveTab] = useState("recentMatches");
  const [currentCoach, setCurrentCoach] = useState(null);

  const token = localStorage.getItem("jwtToken");

  const recentPagination = UsePagination(recentMatches, 5);
  const upcomingPagination = UsePagination(upcomingMatches, 5);

  useEffect(() => {
    // Fetch team information
    axios
      .get(`${BASE_URL}/api/teams/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setTeam(response.data))
      .catch((error) => console.error("Error fetching team:", error));

    // Fetch recent matches
    axios
      .get(`${BASE_URL}/api/matches/recent/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setRecentMatches(response.data))
      .catch((error) => console.error("Error fetching recent matches:", error));

    // Fetch upcoming matches
    axios
      .get(`${BASE_URL}/api/matches/upcoming/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setUpcomingMatches(response.data))
      .catch((error) =>
        console.error("Error fetching upcoming matches:", error),
      );

    // Fetch active players
    axios
      .get(`${BASE_URL}/api/player-contracts/active-players/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setActivePlayers(response.data))
      .catch((error) => console.error("Error fetching active players:", error));

    // Fetch current coach
    axios
      .get(`${BASE_URL}/api/coach-contracts/team/${id}/current-coach`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setCurrentCoach(response.data))
      .catch((error) => {
        console.error("Error fetching current coach:", error);
        setCurrentCoach(null);
      });
  }, [id, token]);

  const renderRecentMatches = () => {
    const { currentResults, totalPages, currentPage, handlePageChange } =
      recentPagination;

    return (
      <Card className="mb-4">
        <Card.Body>
          <h5>Recent matches</h5>
          <Table bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Opponent</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {currentResults.map((match) => (
                <tr key={match.id}>
                  <td>{new Date(match.dateTime).toLocaleDateString()}</td>
                  <td>
                    <Link
                      to={`/team/${
                        match.homeTeam.id === team.id
                          ? match.awayTeam.id
                          : match.homeTeam.id
                      }`}
                      className="text-decoration-none"
                    >
                      {match.homeTeam.id === team.id
                        ? match.awayTeam.name
                        : match.homeTeam.name}
                    </Link>
                  </td>
                  <td>
                    {match.homeTeam.id === team.id
                      ? `${match.homeGoals} - ${match.awayGoals}`
                      : `${match.awayGoals} - ${match.homeGoals}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </Card.Body>
      </Card>
    );
  };

  const renderUpcomingMatches = () => {
    const { currentResults, totalPages, currentPage, handlePageChange } =
      upcomingPagination;

    return (
      <Card className="mb-4">
        <Card.Body>
          <h5>Upcoming matches</h5>
          <Table bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Opponent</th>
              </tr>
            </thead>
            <tbody>
              {currentResults.map((match) => (
                <tr key={match.id}>
                  <td>{new Date(match.dateTime).toLocaleDateString()}</td>
                  <td>
                    <Link
                      to={`/team/${
                        match.homeTeam.id === team.id
                          ? match.awayTeam.id
                          : match.homeTeam.id
                      }`}
                      className="text-decoration-none"
                    >
                      {match.homeTeam.id === team.id
                        ? match.awayTeam.name
                        : match.homeTeam.name}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </Card.Body>
      </Card>
    );
  };

  const renderPlayers = () => (
    <Card className="mb-4">
      <Card.Body>
        <h5>Players</h5>
        <Table bordered hover>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Player</th>
              <th>Position</th>
            </tr>
          </thead>
          <tbody>
            {activePlayers.map((player) => (
              <tr key={player.id}>
                <td>
                  <PlayerImageVerySmall player={player} />
                </td>
                <td>
                  <Link
                    to={`/player/${player.id}`}
                    className="text-decoration-none"
                  >
                    {player.firstName +
                      " " +
                      player.lastName +
                      " " +
                      player.nickname}
                  </Link>
                </td>
                <td>{player.position.name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );

  if (!team) return <p>Sorry, we can't find that team :(</p>;

  return (
    <Container fluid>
      <Row>
        <Col md={3} className="bg-light border-right">
          <Sidebar />
        </Col>
        <Col md={9} style={{ marginTop: "20px" }}>
          <div className="d-flex align-items-center mb-4">
            <TeamImage team={team} />
            <div className="ms-3">
              <h3>{team.name}</h3>
              {currentCoach ? (
                <p className="text-muted">
                  Trener:{" "}
                  <Link
                    to={`/coach/${currentCoach.coach.id}`}
                    className="text-decoration-none"
                  >
                    {currentCoach.coach.firstName} {currentCoach.coach.lastName}
                  </Link>
                </p>
              ) : (
                <p className="text-muted">Trener: Brak</p>
              )}
            </div>
          </div>
          <Nav
            variant="tabs"
            activeKey={activeTab}
            onSelect={(selectedKey) => setActiveTab(selectedKey)}
            className="justify-content-center"
          >
            <Nav.Item>
              <Nav.Link eventKey="recentMatches">Results</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="upcomingMatches">Matches</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="players">Players</Nav.Link>
            </Nav.Item>
          </Nav>
          {activeTab === "recentMatches" && renderRecentMatches()}
          {activeTab === "upcomingMatches" && renderUpcomingMatches()}
          {activeTab === "players" && renderPlayers()}
        </Col>
      </Row>
    </Container>
  );
};

export default TeamPage;
