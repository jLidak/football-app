import React from "react";
import "./MatchStatistics.css";
import TeamImageVerySmall from "./TeamImageVerySmall";

const MatchStatistics = ({ match }) => {
  if (!match) return null;

  const stats = [
    {
      label: "Possession",
      home: match.homePossession,
      away: match.awayPossession,
      isPercentage: true,
    },
    {
      label: "Shots (on goal)",
      home: match.homeShots,
      homeAccurate: match.homeShotsOnGoal,
      away: match.awayShots,
      awayAccurate: match.awayShotsOnGoal,
    },
    {
      label: "Passes (accurate)",
      home: match.homePasses,
      homeAccurate: match.homeAccuratePasses,
      away: match.awayPasses,
      awayAccurate: match.awayAccuratePasses,
    },
    {
      label: "Corners",
      home: match.homeCorners,
      away: match.awayCorners,
    },
    {
      label: "Fouls",
      home: match.homeFouls,
      away: match.awayFouls,
    },
  ];

  const renderBar = (
    label,
    home,
    homeAccurate,
    away,
    awayAccurate,
    isPercentage = false,
  ) => {
    const homeWidth = (home / Math.max(home, away)) * 100;
    const awayWidth = (away / Math.max(home, away)) * 100;
    const homeAccurateWidth = homeAccurate ? (homeAccurate / home) * 100 : 0;
    const awayAccurateWidth = awayAccurate ? (awayAccurate / away) * 100 : 0;

    return (
      <div className="stat-row" key={label}>
        <div className="stat-label">{label}</div>
        <div className="stat-bars">
          <div className="bar home" style={{ width: `${homeWidth}%` }}>
            <div
              className="bar-accurate"
              style={{
                width: `${homeAccurateWidth}%`,
                backgroundColor: "#32b84f",
              }}
            ></div>
            <span className="bar-value">
              {home}
              {isPercentage ? "%" : ""}
              {homeAccurate ? ` (${homeAccurate})` : ""}
            </span>
            <TeamImageVerySmall
              team={match.homeTeam}
              customStyle={{ marginLeft: "10px" }}
            />
          </div>
          <div className="bar away" style={{ width: `${awayWidth}%` }}>
            <div
              className="bar-accurate"
              style={{
                width: `${awayAccurateWidth}%`,
                backgroundColor: "#fc7100",
              }}
            ></div>
            <span className="bar-value">
              {away}
              {isPercentage ? "%" : ""}
              {awayAccurate ? ` (${awayAccurate})` : ""}
            </span>
            <TeamImageVerySmall
              team={match.awayTeam}
              customStyle={{ marginLeft: "10px" }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="match-statistics">
      {stats.map((stat) =>
        stat.homeAccurate !== undefined
          ? renderBar(
              stat.label,
              stat.home,
              stat.homeAccurate,
              stat.away,
              stat.awayAccurate,
              stat.isPercentage,
            )
          : renderBar(
              stat.label,
              stat.home,
              0,
              stat.away,
              0,
              stat.isPercentage,
            ),
      )}
    </div>
  );
};

export default MatchStatistics;
