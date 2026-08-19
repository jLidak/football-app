//import React, { useState } from 'react';
//import axios from 'axios';
//import { Form, Button, Container } from 'react-bootstrap';
//import { useParams } from 'react-router-dom';
//
//const AddPlayersMatchSquadForm = () => {
//    const { matchSquadId } = useParams();
//    const [playerId, setPlayerId] = useState('');
//    const [entryMinute, setEntryMinute] = useState(0);
//    const [exitMinute, setExitMinute] = useState(90);
//
//    const handleSubmit = (e) => {
//        e.preventDefault();
//        const token = localStorage.getItem('jwtToken');
//
//        const playersMatchSquadData = {
//            matchSquadId,
//            playerId,
//            entryMinute,
//            exitMinute
//        };
//
//        axios.post('http://localhost:8080/api/players-match-squad/add', playersMatchSquadData, {
//            headers: { Authorization: `Bearer ${token}` }
//        })
//        .then(response => {
//            alert('Player added to match squad successfully');
//        })
//        .catch(error => {
//            console.error('Error adding player to match squad:', error);
//            alert('Failed to add player to match squad');
//        });
//    };
//
//    return (
//        <Container className="mt-5">
//            <h1 className="text-center mb-4">Add Player to Match Squad</h1>
//            <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
//                <Form.Group controlId="formPlayerId" className="mb-3">
//                    <Form.Label>Player ID</Form.Label>
//                    <Form.Control
//                        type="text"
//                        value={playerId}
//                        onChange={(e) => setPlayerId(e.target.value)}
//                        required
//                    />
//                </Form.Group>
//
//                <Form.Group controlId="formEntryMinute" className="mb-3">
//                    <Form.Label>Entry Minute</Form.Label>
//                    <Form.Control
//                        type="number"
//                        value={entryMinute}
//                        onChange={(e) => setEntryMinute(parseInt(e.target.value))}
//                        min="0"
//                        required
//                    />
//                </Form.Group>
//
//                <Form.Group controlId="formExitMinute" className="mb-3">
//                    <Form.Label>Exit Minute</Form.Label>
//                    <Form.Control
//                        type="number"
//                        value={exitMinute}
//                        onChange={(e) => setExitMinute(parseInt(e.target.value))}
//                        min="0"
//                        required
//                    />
//                </Form.Group>
//
//                <Button variant="primary" type="submit" className="w-100 mt-3">Add Player to Squad</Button>
//            </Form>
//        </Container>
//    );
//};
//
//export default AddPlayersMatchSquadForm;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, ListGroup } from "react-bootstrap";
import { useParams } from "react-router-dom";

const AddPlayersMatchSquadForm = () => {
  const { matchSquadId } = useParams();
  const [teamId, setTeamId] = useState(null);
  const [playerSearchQuery, setPlayerSearchQuery] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [entryMinute, setEntryMinute] = useState(0);
  const [exitMinute, setExitMinute] = useState(90);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const teamId = matchSquadId; // Zakładam, że `matchSquadId` można użyć jako `teamId`, lub przekaż go odpowiednio.

    if (playerSearchQuery && token) {
      axios
        .get(
          `http://localhost:8080/api/player-contract/active-players/${teamId}?query=${playerSearchQuery}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then((response) => setFilteredPlayers(response.data))
        .catch((error) =>
          console.error("Error fetching active players:", error),
        );
    } else {
      setFilteredPlayers([]);
    }
  }, [playerSearchQuery, matchSquadId]);

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player);
    setPlayerSearchQuery(player.name);
    setFilteredPlayers([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    if (!selectedPlayer) {
      alert("Please select a player!");
      return;
    }

    const playersMatchSquadData = {
      matchSquadId,
      playerId: selectedPlayer.id,
      entryMinute,
      exitMinute,
    };

    axios
      .post(
        "http://localhost:8080/api/players-match-squad/add",
        playersMatchSquadData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((response) => {
        alert("Player added to match squad successfully");
      })
      .catch((error) => {
        console.error("Error adding player to match squad:", error);
        alert("Failed to add player to match squad");
      });
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Add Player to Match Squad</h1>
      <Form
        onSubmit={handleSubmit}
        className="p-4 border rounded shadow-sm bg-light"
      >
        <Form.Group controlId="formPlayerSearch" className="mb-3">
          <Form.Label>Search Player</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search for a player"
            value={playerSearchQuery}
            onChange={(e) => setPlayerSearchQuery(e.target.value)}
          />
          {filteredPlayers.length > 0 && (
            <ListGroup style={{ maxHeight: "200px", overflowY: "auto" }}>
              {filteredPlayers.map((player) => (
                <ListGroup.Item
                  key={player.id}
                  action
                  onClick={() => handlePlayerSelect(player)}
                >
                  {player.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Form.Group>

        <Form.Group controlId="formEntryMinute" className="mb-3">
          <Form.Label>Entry Minute</Form.Label>
          <Form.Control
            type="number"
            value={entryMinute}
            onChange={(e) => setEntryMinute(parseInt(e.target.value))}
            min="0"
            required
          />
        </Form.Group>

        <Form.Group controlId="formExitMinute" className="mb-3">
          <Form.Label>Exit Minute</Form.Label>
          <Form.Control
            type="number"
            value={exitMinute}
            onChange={(e) => setExitMinute(parseInt(e.target.value))}
            min="0"
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mt-3">
          Add Player to Squad
        </Button>
      </Form>
    </Container>
  );
};

export default AddPlayersMatchSquadForm;

////  NIE TESTOWANY
//import React, { useState, useEffect } from 'react';
//import axios from 'axios';
//import { Form, Button, Container, ListGroup } from 'react-bootstrap';
//import { useParams } from 'react-router-dom';
//
//const AddPlayersMatchSquadForm = () => {
//    const { matchSquadId } = useParams();
//    const [teamId, setTeamId] = useState(null); // Przechowuje teamId
//    const [playerSearchQuery, setPlayerSearchQuery] = useState('');
//    const [filteredPlayers, setFilteredPlayers] = useState([]);
//    const [selectedPlayer, setSelectedPlayer] = useState(null);
//    const [entryMinute, setEntryMinute] = useState(0);
//    const [exitMinute, setExitMinute] = useState(90);
//
//    useEffect(() => {
//        const token = localStorage.getItem('jwtToken');
//
//        // Pobierz MatchSquad, aby uzyskać teamId
//        axios.get(`http://localhost:8080/api/match-squad/${matchSquadId}`, {
//            headers: { Authorization: `Bearer ${token}` }
//        })
//        .then(response => {
//            setTeamId(response.data.teamId); // Ustaw teamId na podstawie danych z MatchSquad
//        })
//        .catch(error => console.error('Error fetching MatchSquad:', error));
//    }, [matchSquadId]);
//
//    useEffect(() => {
//        const token = localStorage.getItem('jwtToken');
//
//        // Pobierz aktywnych zawodników tylko, gdy teamId jest dostępne
//        if (teamId && playerSearchQuery && token) {
//            axios.get(`http://localhost:8080/api/player-contract/active-players/${teamId}?query=${playerSearchQuery}`, {
//                headers: { Authorization: `Bearer ${token}` }
//            })
//            .then(response => setFilteredPlayers(response.data))
//            .catch(error => console.error('Error fetching active players:', error));
//        } else {
//            setFilteredPlayers([]);
//        }
//    }, [playerSearchQuery, teamId]);
//
//    const handlePlayerSelect = (player) => {
//        setSelectedPlayer(player);
//        setPlayerSearchQuery(player.name);
//        setFilteredPlayers([]);
//    };
//
//    const handleSubmit = (e) => {
//        e.preventDefault();
//        const token = localStorage.getItem('jwtToken');
//
//        if (!selectedPlayer) {
//            alert('Please select a player!');
//            return;
//        }
//
//        const playersMatchSquadData = {
//            matchSquadId,
//            playerId: selectedPlayer.id,
//            entryMinute,
//            exitMinute
//        };
//
//        axios.post('http://localhost:8080/api/players-match-squad/add', playersMatchSquadData, {
//            headers: { Authorization: `Bearer ${token}` }
//        })
//        .then(response => {
//            alert('Player added to match squad successfully');
//        })
//        .catch(error => {
//            console.error('Error adding player to match squad:', error);
//            alert('Failed to add player to match squad');
//        });
//    };
//
//    return (
//        <Container className="mt-5">
//            <h1 className="text-center mb-4">Add Player to Match Squad</h1>
//            <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
//                <Form.Group controlId="formPlayerSearch" className="mb-3">
//                    <Form.Label>Search Player</Form.Label>
//                    <Form.Control
//                        type="text"
//                        placeholder="Search for a player"
//                        value={playerSearchQuery}
//                        onChange={(e) => setPlayerSearchQuery(e.target.value)}
//                    />
//                    {filteredPlayers.length > 0 && (
//                        <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
//                            {filteredPlayers.map(player => (
//                                <ListGroup.Item
//                                    key={player.id}
//                                    action
//                                    onClick={() => handlePlayerSelect(player)}
//                                >
//                                    {player.name}
//                                </ListGroup.Item>
//                            ))}
//                        </ListGroup>
//                    )}
//                </Form.Group>
//
//                <Form.Group controlId="formEntryMinute" className="mb-3">
//                    <Form.Label>Entry Minute</Form.Label>
//                    <Form.Control
//                        type="number"
//                        value={entryMinute}
//                        onChange={(e) => setEntryMinute(parseInt(e.target.value))}
//                        min="0"
//                        required
//                    />
//                </Form.Group>
//
//                <Form.Group controlId="formExitMinute" className="mb-3">
//                    <Form.Label>Exit Minute</Form.Label>
//                    <Form.Control
//                        type="number"
//                        value={exitMinute}
//                        onChange={(e) => setExitMinute(parseInt(e.target.value))}
//                        min="0"
//                        required
//                    />
//                </Form.Group>
//
//                <Button variant="primary" type="submit" className="w-100 mt-3">Add Player to Squad</Button>
//            </Form>
//        </Container>
//    );
//};
//
//export default AddPlayersMatchSquadForm;
