import React from "react";
import { useNavigate } from "react-router-dom";
const MatchEvents = ({ match }) => {
  const navigate = useNavigate(); // Dodaj useNavigate

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

  const formatPlayerName = (player) => {
    if (!player || !player.firstName || !player.lastName) {
      return "Unknown Player";
    }
    const firstInitial = player.firstName.charAt(0).toUpperCase();
    return `${firstInitial}. ${player.lastName}`;
  };

  const formatMinute = (minute, partOfGame) => {
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
    if (!match.events) return null;
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
    if (!match.events) return null;
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
    if (!match.events || !Array.isArray(match.events)) return []; // Zabezpieczenie

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
    if (!match.events || !Array.isArray(match.events)) {
      return <p>No events available for this match.</p>; // Zabezpieczenie
    }

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
              // Zabezpieczenie przed null
              if (!event.player || !event.player.team) {
                return null;
              }

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
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/player/${event.player.id}`)}
                      >
                        {formatPlayerName(event.player)}
                      </span>
                    </>
                  )}
                  {!isHomeTeam && (
                    <>
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/player/${event.player.id}`)}
                      >
                        {formatPlayerName(event.player)}
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
  return <div>{renderEvents()}</div>;
};

export default MatchEvents;
