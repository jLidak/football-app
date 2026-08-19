import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, Tab, Table, Card, Row, Col } from "react-bootstrap";
import "./LeagueStandings.css";
import TeamImageVerySmall from "./TeamImageVerySmall";

const BASE_URL = "http://localhost:8080";

const LeagueStandings = ({ leagueId }) => {
  const [activeTab, setActiveTab] = useState("groupStage");
  const [groups, setGroups] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [knockoutMatches, setKnockoutMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupStageData = async () => {
      try {
        const groupResponse = await axios.get(
          `${BASE_URL}/api/leagueGroups/league/${leagueId}`,
        );
        setGroups(groupResponse.data);

        const statsPromises = groupResponse.data.map((group) =>
          axios.get(`${BASE_URL}/api/teams/group/${group.id}/points`),
        );
        const statsResponses = await Promise.all(statsPromises);

        const statsData = statsResponses.map((res) =>
          Array.isArray(res.data) ? res.data : [],
        );
        setStatistics(statsData);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchKnockoutStageData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/matches/knockout/${leagueId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Pobierz token z localStorage
            },
          },
        );
        setKnockoutMatches(response.data); // Zapisz dane w stanie
      } catch (err) {
        console.error("Error fetching knockout stage data:", err);
        setError(err.message);
      }
    };

    setLoading(true);
    Promise.all([fetchGroupStageData(), fetchKnockoutStageData()]).finally(() =>
      setLoading(false),
    );
  }, [leagueId]);

  if (loading) return <p>Loading standings...</p>;
  if (error) return <p>Error: {error}</p>;

  const renderGroupStage = () => (
    <div>
      {groups.map((group, index) => (
        <Card key={group.id} className="mb-4">
          <Card.Header>
            <strong>{group.name}</strong>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover className="group-stage-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Team</th>
                  <th>MP</th>
                  <th>W</th>
                  <th>D</th>
                  <th>L</th>
                  <th>GD</th>
                  <th>PTS</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(statistics[index]) &&
                statistics[index].length > 0 ? (
                  statistics[index].map((teamStats, i) => (
                    <tr key={teamStats.team.id}>
                      <td>{i + 1}</td>
                      <td style={{ textAlign: "left" }}>
                        <TeamImageVerySmall
                          team={teamStats.team}
                          style={{ marginRight: "10px" }}
                        />

                        {teamStats.team.name}
                      </td>
                      <td>{teamStats.played}</td>
                      <td>{teamStats.won}</td>
                      <td>{teamStats.drawn}</td>
                      <td>{teamStats.lost}</td>
                      <td>{teamStats.goalDifference}</td>
                      <td>{teamStats.points}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center" }}>
                      No statistics available for this group.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      ))}
    </div>
  );

  const sortStages = (stages) => {
    const stageOrder = {
      "1/128": 1,
      "1/64": 2,
      "1/32": 3,
      "1/16": 4,
      "1/8": 5,
      "1/4": 6,
      "1/2": 7,
      FINAL: 8,
    };
    return stages.sort((a, b) => stageOrder[a] - stageOrder[b]);
  };
  const renderKnockoutStage = () => {
    const stages = [
      ...new Set(knockoutMatches.map((match) => match.stage.name)),
    ];
    const sortedStages = sortStages(stages);

    // Grupowanie meczów
    const groupedMatches = knockoutMatches.reduce((acc, match) => {
      const key = `${match.stage.name}-${match.homeTeam.name}-${match.awayTeam.name}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(match);
      return acc;
    }, {});

    return (
      <div className="knockout-stage-container">
        <div className="knockout-stage">
          {sortedStages.map((stage) => (
            <div key={stage} className="knockout-column">
              <h5 className="text-center">{stage}</h5>
              <div className="matches">
                {Object.entries(groupedMatches)
                  .filter(([key]) => key.startsWith(stage))
                  .map(([key, matches]) => (
                    <div key={key} className="match-card">
                      <div className="team-row">
                        <TeamImageVerySmall
                          team={matches[0].homeTeam}
                          style={{ marginRight: "5px" }}
                        />
                        <span>{matches[0].homeTeam.name}</span>
                        <span className="goals">
                          {matches
                            .map((m) =>
                              m.homeGoals !== null ? m.homeGoals : "-",
                            )
                            .join("    ")}
                        </span>
                      </div>
                      <div className="team-row">
                        <TeamImageVerySmall
                          team={matches[0].awayTeam}
                          style={{ marginRight: "5px" }}
                        />
                        <span>{matches[0].awayTeam.name}</span>
                        <span className="goals">
                          {matches
                            .map((m) =>
                              m.awayGoals !== null ? m.awayGoals : "-",
                            )
                            .join("    ")}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Tabs
      activeKey={activeTab}
      onSelect={(tab) => setActiveTab(tab)}
      className="mb-3"
    >
      <Tab eventKey="groupStage" title="Group Stage">
        {renderGroupStage()}
      </Tab>
      <Tab eventKey="knockoutStage" title="Knockout Stage">
        {renderKnockoutStage()}
      </Tab>
    </Tabs>
  );
};

export default LeagueStandings;
