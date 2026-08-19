import React from "react";
import { Modal } from "react-bootstrap";
import TeamImage from "./TeamImage";
import "./MatchDetail.css";

const MatchDetail = ({ show, onHide, match, toggleFavorite, isFavorite }) => {
  if (!match) return null;

  const isUpcoming = match.status === "UPCOMING";

  // Helper function to get the event icon
  const getEventIcon = (type) => {
    switch (type) {
      case "GOAL":
        return "goal.png";
      case "PENALTY":
        return "penalty.png";
      case "FREE_KICK":
        return "free-kick.png";
      case "RED_CARD":
        return "red_card.png";
      case "YELLOW_CARD":
        return "yellow_card.png";
      case "YELLOW_RED_CARD":
        return "yellow_red_card.png";
      case "SUB_IN":
        return "substitute.png";
      default:
        return null;
    }
  };

  // Helper function to format the player's name
  const formatPlayerName = (player) => {
    if (!player || !player.firstName || !player.lastName) {
      return "Unknown Player";
    }
    const firstInitial = player.firstName.charAt(0).toUpperCase();
    return `${firstInitial}. ${player.lastName}`;
  };

  // Helper function to format event minutes based on part of the game
  const formatMinute = (minute, partOfGame) => {
    console.log(minute, partOfGame);
    if (partOfGame === "FIRST_HALF") {
      return minute > 45 ? `45+${minute - 45}'` : `${minute}'`;
    } else if (partOfGame === "SECOND_HALF") {
      return minute > 45 ? `90+${minute - 45}'` : `${minute + 45}'`;
    } else if (partOfGame === "OT_FIRST_HALF") {
      return minute > 15 ? `105+${minute - 15}'` : `${minute + 90}'`;
    } else if (partOfGame === "OT_SECOND_HALF") {
      return minute > 15 ? `120+${minute - 15}'` : `${minute + 105}'`;
    }
    return `${minute}'`;
  };

  // Find assist for a given goal event
  const findAssist = (goalEvent) => {
    const assistEvent = match.events.find(
      (event) =>
        event.type === "ASSIST" &&
        event.minute === goalEvent.minute &&
        event.partOfGame === goalEvent.partOfGame,
    );
    return assistEvent ? formatPlayerName(assistEvent.player) : null;
  };

  // Find the player being subbed off for a sub_in event
  const findSubOff = (subInEvent) => {
    const subOffEvent = match.events.find(
      (event) =>
        event.type === "SUB_OFF" &&
        event.id === subInEvent.id + 1 &&
        event.minute === subInEvent.minute &&
        event.partOfGame === subInEvent.partOfGame,
    );
    return subOffEvent ? formatPlayerName(subOffEvent.player) : null;
  };

  // Filter events to combine yellow and red cards into a yellow-red card if applicable
  const combineYellowRedCards = () => {
    const eventsToShow = [];
    const seenPlayers = new Set();

    match.events.forEach((event) => {
      if (event.type === "YELLOW_CARD") {
        const redCardEvent = match.events.find(
          (e) =>
            e.type === "RED_CARD" &&
            e.minute === event.minute &&
            e.partOfGame === event.partOfGame &&
            e.player.id === event.player.id,
        );

        if (redCardEvent) {
          if (!seenPlayers.has(event.player.id)) {
            eventsToShow.push({
              ...event,
              type: "YELLOW_RED_CARD", // Combine into a single event
            });
            seenPlayers.add(event.player.id);
          }
        } else {
          eventsToShow.push(event); // Include standalone yellow card
        }
      } else if (event.type === "RED_CARD") {
        // Ensure standalone red cards are included
        const yellowCardEvent = match.events.find(
          (e) =>
            e.type === "YELLOW_CARD" &&
            e.minute === event.minute &&
            e.partOfGame === event.partOfGame &&
            e.player.id === event.player.id,
        );

        // Only include the red card if it's not combined with a yellow card
        if (!yellowCardEvent) {
          eventsToShow.push(event);
        }
      } else {
        eventsToShow.push(event); // Include all other event types
      }
    });

    return eventsToShow;
  };
  const partOfGameLabels = {
    FIRST_HALF: "1ST HALF",
    SECOND_HALF: "2ND HALF",
    OT_FIRST_HALF: "EXTRA TIME 1ST HALF",
    OT_SECOND_HALF: "EXTRA TIME 2ND HALF",
    PENALTIES: "PENALTIES",
  };

  // Render events grouped by partOfGame and sorted by minute
  const renderEvents = () => {
    const filteredEvents = combineYellowRedCards().filter((event) =>
      getEventIcon(event.type),
    );

    if (!filteredEvents.length) {
      return <p>No relevant events for this match.</p>;
    }

    const partOrder = [
      "FIRST_HALF",
      "SECOND_HALF",
      "OT_FIRST_HALF",
      "OT_SECOND_HALF",
      "PENALTIES",
    ];

    const groupedEvents = filteredEvents.reduce((acc, event) => {
      if (!acc[event.partOfGame]) {
        acc[event.partOfGame] = [];
      }
      acc[event.partOfGame].push(event);
      return acc;
    }, {});

    const sortedParts = partOrder.filter((part) => groupedEvents[part]);

    return sortedParts.map((part) => (
      <div key={part} className="event-section">
        <h6 className="part-label">{partOfGameLabels[part]}</h6>
        <hr />
        <ul className="event-list">
          {groupedEvents[part]
            .sort((a, b) => a.minute - b.minute)
            .map((event) => {
              const isHomeTeam = event.player.team.id === match.homeTeam.id;
              let additionalInfo = null;

              if (event.type === "GOAL") {
                additionalInfo = findAssist(event);
              } else if (event.type === "SUB_IN") {
                additionalInfo = findSubOff(event);
              }

              return (
                <li
                  key={event.id}
                  className={`event-item ${isHomeTeam ? "home-event" : "away-event"}`}
                >
                  {isHomeTeam && (
                    <>
                      <span className="minute">
                        {formatMinute(event.minute, event.partOfGame)}
                      </span>
                      <img
                        src={`/assets/icons/${getEventIcon(event.type)}`}
                        alt={event.type}
                        className="event-icon"
                      />
                      <span>
                        {formatPlayerName(event.player)}
                        {additionalInfo && ` (${additionalInfo})`}
                      </span>
                    </>
                  )}
                  {!isHomeTeam && (
                    <>
                      <span>
                        {formatPlayerName(event.player)}
                        {additionalInfo && ` (${additionalInfo})`}
                      </span>
                      <img
                        src={`/assets/icons/${getEventIcon(event.type)}`}
                        alt={event.type}
                        className="event-icon"
                      />
                      <span>
                        {formatMinute(event.minute, event.partOfGame)}
                      </span>
                    </>
                  )}
                </li>
              );
            })}
        </ul>
      </div>
    ));
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      dialogClassName="custom-modal"
      contentClassName="custom-modal-content"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <div className="match-detail-header">
            <img
              src={`/assets/flags/${match.league.country.code}.svg`}
              alt={match.league.country.name}
              className="match-detail-flag"
            />
            <span>
              {match.league.name} &gt; Round {match.round}
            </span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="match-detail-body">
          <div className="team-section">
            <i
              className={`bi ${
                isFavorite("teams", match.homeTeam.id)
                  ? "bi-star-fill text-warning"
                  : "bi-star"
              }`}
              onClick={() => toggleFavorite("teams", match.homeTeam)}
              style={{ cursor: "pointer", marginRight: "10px" }}
            ></i>
            <div className="team-info">
              <TeamImage team={match.homeTeam} />
              <div className="team-name">{match.homeTeam.name}</div>
            </div>
          </div>

          <div className="match-info">
            <div className="match-date">
              {new Date(match.dateTime).toLocaleDateString("pl-PL")}{" "}
              {new Date(match.dateTime).toLocaleTimeString("pl-PL", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="match-score">
              {isUpcoming ? (
                <span className="match-vs">-</span>
              ) : (
                <span>
                  {match.homeGoals} : {match.awayGoals}
                </span>
              )}
            </div>
          </div>

          <div className="team-section">
            <div className="team-info">
              <TeamImage team={match.awayTeam} />
              <div className="team-name">{match.awayTeam.name}</div>
            </div>
            <i
              className={`bi ${
                isFavorite("teams", match.awayTeam.id)
                  ? "bi-star-fill text-warning"
                  : "bi-star"
              }`}
              onClick={() => toggleFavorite("teams", match.awayTeam)}
              style={{ cursor: "pointer", marginLeft: "10px" }}
            ></i>
          </div>
        </div>

        <div className="match-events">{renderEvents()}</div>
      </Modal.Body>
    </Modal>
  );
};

export default MatchDetail;
