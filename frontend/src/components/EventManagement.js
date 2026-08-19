import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Button, ListGroup } from "react-bootstrap";
import TeamImage from "./TeamImage";
import TeamImageSmall from "./TeamImageSmall";
import PlayerImageSmall from "./PlayerImageSmall";
import { Col, Row } from "reactstrap";

const EventManagement = ({ matchId, matchDetails }) => {
  const [events, setEvents] = useState([]);
  const [firstSquadPlayers, setFirstSquadPlayers] = useState([]);
  const [substitutePlayers, setSubstitutePlayers] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);

  const [eventData, setEventData] = useState({
    type: "GOAL",
    playerId: "",
    assistingPlayerId: "",
    subOffPlayerId: "",
    minute: "",
    partOfGame: "FIRST_HALF",
  });

  useEffect(() => {
    // Pobranie typów zdarzeń
    axios
      .get("http://localhost:8080/api/events/types", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })
      .then((response) => setEventTypes(response.data))
      .catch((error) => console.error("Error fetching event types:", error));

    // Pobranie zawodników z pierwszego składu
    axios
      .get(`http://localhost:8080/api/match-squad/first-squad/${matchId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })
      .then((response) => setFirstSquadPlayers(response.data))
      .catch((error) =>
        console.error("Error fetching first squad players:", error),
      );

    // Pobranie zawodników-rezerwowych
    axios
      .get(`http://localhost:8080/api/match-squad/substitutes/${matchId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })
      .then((response) => setSubstitutePlayers(response.data))
      .catch((error) =>
        console.error("Error fetching substitute players:", error),
      );

    // Pobranie zdarzeń dla meczu
    fetchEvents();
  }, [matchId]);

  const fetchEvents = () => {
    axios
      .get(`http://localhost:8080/api/events/match/${matchId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })
      .then((response) => {
        const partOfGameOrder = {
          FIRST_HALF: 1,
          SECOND_HALF: 2,
          OT_FIRST_HALF: 3,
          OT_SECOND_HALF: 4,
          PENALTIES: 5,
        };

        const sortedEvents = response.data.sort((a, b) => {
          // Sortowanie po `partOfGame` według zdefiniowanego porządku
          const partA = partOfGameOrder[a.partOfGame] || 99; // Jeśli brak `partOfGame`, daj najwyższy priorytet
          const partB = partOfGameOrder[b.partOfGame] || 99;

          if (partA !== partB) {
            return partA - partB;
          }
          // Sortowanie po `minute`
          return a.minute - b.minute;
        });

        setEvents(sortedEvents);
      })
      .catch((error) =>
        console.error("Error fetching events for match:", error),
      );
  };

  const handleAddEvent = (e) => {
    e.preventDefault();

    const eventsToSubmit = [
      {
        type: eventData.type,
        playerId: eventData.playerId || null,
        minute: eventData.minute,
        partOfGame: eventData.partOfGame,
        matchId,
        dateTime: eventData.dateTime || null, // Dodanie dateTime
      },
    ];

    if (eventData.type === "GOAL" && eventData.assistingPlayerId) {
      eventsToSubmit.push({
        type: "ASSIST",
        playerId: eventData.assistingPlayerId,
        minute: eventData.minute,
        partOfGame: eventData.partOfGame,
        matchId,
        dateTime: eventData.dateTime || null, // Dodanie dateTime
      });
    }

    if (eventData.type === "SUB_IN") {
      if (!eventData.subOffPlayerId) {
        alert("Please select a player to be substituted off.");
        return;
      }
      eventsToSubmit.push({
        type: "SUB_OFF",
        playerId: eventData.subOffPlayerId,
        minute: eventData.minute,
        partOfGame: eventData.partOfGame,
        matchId,
        dateTime: eventData.dateTime || null, // Dodanie dateTime
      });
    }

    axios
      .post("http://localhost:8080/api/events/add-batch", eventsToSubmit, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })
      .then(() => {
        alert("Event(s) added successfully");
        setEventData({
          type: "GOAL",
          playerId: "",
          assistingPlayerId: "",
          subOffPlayerId: "",
          minute: "",
          partOfGame: "FIRST_HALF",
          dateTime: "",
        });
        fetchEvents();
      })
      .catch((error) => console.error("Error adding event(s):", error));
  };

  const handleDeleteEvent = (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }
    axios
      .delete(`http://localhost:8080/api/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })
      .then(() => {
        alert("Event deleted successfully");
        fetchEvents();
      })
      .catch((error) => console.error("Error deleting event:", error));
  };

  const renderFields = () => {
    const commonFields = (
      <>
        <Form.Group controlId="formMinute" className="mb-3">
          <Form.Label>Minute</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter minute"
            value={eventData.minute}
            onChange={(e) =>
              setEventData({ ...eventData, minute: e.target.value })
            }
            required
          />
        </Form.Group>
      </>
    );

    if (eventData.type === "MATCH_END") {
      return null; // Brak pól w formularzu
    }

    const isDateTimeOnlyEvent = [
      "MATCH_START",
      "SECOND_HALF_START",
      "OT_FIRST_HALF_START",
      "OT_SECOND_HALF_START",
      "PENALTIES_START",
    ].includes(eventData.type);
    if (isDateTimeOnlyEvent) {
      return (
        <Form.Group controlId="formDateTime" className="mb-3">
          <Form.Label>Event DateTime</Form.Label>
          <Form.Control
            type="datetime-local"
            value={eventData.dateTime}
            onChange={(e) =>
              setEventData({ ...eventData, dateTime: e.target.value })
            }
            step="1"
            required
          />
        </Form.Group>
      );
    }
    return (
      <>
        {commonFields}
        {eventData.type !== "MATCH_START" && eventData.type !== "MATCH_END" && (
          <Form.Group controlId="formPartOfGame" className="mb-3">
            <Form.Label>Part of Game</Form.Label>
            <Form.Select
              value={eventData.partOfGame}
              onChange={(e) =>
                setEventData({ ...eventData, partOfGame: e.target.value })
              }
            >
              {[
                "FIRST_HALF",
                "SECOND_HALF",
                "OT_FIRST_HALF",
                "OT_SECOND_HALF",
                "PENALTIES",
              ].map((part) => (
                <option key={part} value={part}>
                  {part}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}
        {[
          "GOAL",
          "ASSIST",
          "YELLOW_CARD",
          "RED_CARD",
          "FREE_KICK",
          "PENALTY",
          "SUB_OFF",
          "ACCURATE_PASS",
          "MISSED_PASS",
          "SHOT_MISSED",
          "SHOT_ON_GOAL",
        ].includes(eventData.type) && (
          <Form.Group controlId="formPlayerId" className="mb-3">
            <Form.Label>Player</Form.Label>
            <Form.Select
              value={eventData.playerId}
              onChange={(e) =>
                setEventData({ ...eventData, playerId: e.target.value })
              }
            >
              <option value="">Select a Player</option>
              {firstSquadPlayers.concat(substitutePlayers).map((player) => (
                <option key={player.id} value={player.id}>
                  {player.firstName} {player.lastName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}
        {eventData.type === "GOAL" && (
          <Form.Group controlId="formAssistingPlayerId" className="mb-3">
            <Form.Label>Assisting Player (Optional)</Form.Label>
            <Form.Select
              value={eventData.assistingPlayerId}
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  assistingPlayerId: e.target.value,
                })
              }
            >
              <option value="">Select a Player</option>
              {firstSquadPlayers.concat(substitutePlayers).map((player) => (
                <option key={player.id} value={player.id}>
                  {player.firstName} {player.lastName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}
        {eventData.type === "SUB_IN" && (
          <>
            <Form.Group controlId="formPlayerId" className="mb-3">
              <Form.Label>Substitute Player</Form.Label>
              <Form.Select
                value={eventData.playerId}
                onChange={(e) =>
                  setEventData({ ...eventData, playerId: e.target.value })
                }
                required
              >
                <option value="">Select a Substitute Player</option>
                {substitutePlayers.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.firstName} {player.lastName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formSubOffPlayerId" className="mb-3">
              <Form.Label>Sub Off Player</Form.Label>
              <Form.Select
                value={eventData.subOffPlayerId}
                onChange={(e) =>
                  setEventData({ ...eventData, subOffPlayerId: e.target.value })
                }
                required
              >
                <option value="">Select a Player</option>
                {firstSquadPlayers.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.firstName} {player.lastName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </>
        )}
        {eventData.type === "MATCH_START" ||
          eventData.type === "SECOND_HALF_START" ||
          eventData.type === "OT_FIRST_HALF_START" ||
          eventData.type === "OT_SECOND_HALF_START" ||
          (eventData.type === "PENALTIES_START" && (
            <Form.Group controlId="formDateTime" className="mb-3">
              <Form.Label>Event DateTime</Form.Label>
              <Form.Control
                type="datetime-local"
                value={eventData.dateTime}
                onChange={(e) =>
                  setEventData({ ...eventData, dateTime: e.target.value })
                }
              />
            </Form.Group>
          ))}
      </>
    );
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center">
        Manage Events for Match: {matchDetails?.id || "Unknown"}
      </h1>
      <Form onSubmit={handleAddEvent} className="mb-4">
        <Form.Group controlId="formEventType" className="mb-3">
          <Form.Label>Event Type</Form.Label>
          <Form.Select
            value={eventData.type}
            onChange={(e) =>
              setEventData({ ...eventData, type: e.target.value })
            }
          >
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        {renderFields()}
        <Button variant="primary" type="submit">
          Add Event
        </Button>
      </Form>

      <h3>Events for Match</h3>
      <ListGroup>
        {events.map((event) => (
          <ListGroup.Item key={event.id}>
            <Row>
              <Col xs={1}>
                {/* Zdjęcie drużyny */}
                {event.player && event.player.team && (
                  <TeamImageSmall team={event.player.team} />
                )}
              </Col>
              <Col xs={1}>
                {/* Zdjęcie zawodnika */}
                {event.player && <PlayerImageSmall player={event.player} />}
              </Col>
              <Col xs={10}>
                {/* Szczegóły zdarzenia */}
                {event.type} - Player: {event.player?.firstName || "N/A"}{" "}
                {event.player?.lastName || ""} - Minute: {event.minute} - Part:{" "}
                {event.partOfGame}
              </Col>
            </Row>
            <Button
              variant="danger"
              size="sm"
              className="float-end"
              onClick={() => handleDeleteEvent(event.id)}
            >
              Delete
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default EventManagement;
