import React, { useEffect, useState } from "react";
import PlayerImageSmall from "./PlayerImageSmall";
import { useNavigate } from "react-router-dom";
import "./MatchLineups.css";

const BASE_URL = "http://localhost:8080"; // Stała dla adresu backendu

const MatchLineups = ({ matchId }) => {
  const [homeFirstSquad, setHomeFirstSquad] = useState([]);
  const [homeBench, setHomeBench] = useState([]);
  const [awayFirstSquad, setAwayFirstSquad] = useState([]);
  const [awayBench, setAwayBench] = useState([]);
  const navigate = useNavigate(); // Dodaj useNavigate

  const token = localStorage.getItem("jwtToken"); // Pobieranie tokena JWT z localStorage

  useEffect(() => {
    const fetchLineups = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` }; // Dodanie tokena do nagłówków

        // Fetch Home Team First Squad
        const homeFirstResponse = await fetch(
          `${BASE_URL}/api/match-squad/first-squad-home/${matchId}?homeTeam=true`,
          { headers },
        );
        const homeFirstData = await homeFirstResponse.json();
        setHomeFirstSquad(homeFirstData);

        // Fetch Home Team Bench
        const homeBenchResponse = await fetch(
          `${BASE_URL}/api/match-squad/substitutes-home/${matchId}?homeTeam=true`,
          { headers },
        );
        const homeBenchData = await homeBenchResponse.json();
        setHomeBench(homeBenchData);

        // Fetch Away Team First Squad
        const awayFirstResponse = await fetch(
          `${BASE_URL}/api/match-squad/first-squad-home/${matchId}?homeTeam=false`,
          { headers },
        );
        const awayFirstData = await awayFirstResponse.json();
        setAwayFirstSquad(awayFirstData);

        // Fetch Away Team Bench
        const awayBenchResponse = await fetch(
          `${BASE_URL}/api/match-squad/substitutes-home/${matchId}?homeTeam=false`,
          { headers },
        );
        const awayBenchData = await awayBenchResponse.json();
        setAwayBench(awayBenchData);
      } catch (error) {
        console.error("Error fetching lineups:", error);
      }
    };

    fetchLineups();
  }, [matchId, token]);

  const renderPlayer = (player, alignImageLeft) => (
    <div
      className={`player-row ${alignImageLeft ? "left-align" : "right-align"}`}
      key={player.id}
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/player/${player.id}`)} // Przejście na stronę zawodnika
    >
      {alignImageLeft && <PlayerImageSmall player={player} />}
      <span>{`${player.firstName} ${player.lastName}`}</span>
      {!alignImageLeft && <PlayerImageSmall player={player} />}
    </div>
  );

  const renderCombinedSection = (title, homePlayers, awayPlayers) => (
    <div className="combined-section">
      <h6 className="part-label">{title}</h6>
      <hr />
      <div className="combined-lineup">
        <div className="team-lineup home-team">
          {homePlayers.map((player) => renderPlayer(player, true))}
        </div>
        <div className="team-lineup away-team">
          {awayPlayers.map((player) => renderPlayer(player, false))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="match-lineups">
      {renderCombinedSection(
        "STARTING LINEUPS",
        homeFirstSquad,
        awayFirstSquad,
      )}
      {renderCombinedSection("SUBSTITUTES", homeBench, awayBench)}
    </div>
  );
};

export default MatchLineups;
