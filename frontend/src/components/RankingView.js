//import React, { useState, useEffect } from 'react';
//import axios from 'axios';
//import { Form, Button, Container, ListGroup } from 'react-bootstrap';
//
//const RankingView = () => {
//    const [rankings, setRankings] = useState([]);
//    const [selectedRanking, setSelectedRanking] = useState('');
//    const [users, setUsers] = useState([]);
//
//    useEffect(() => {
//        // Pobieranie listy rankingów
//        const token = localStorage.getItem('jwtToken');
//        axios
//            .get('http://localhost:8080/api/rankings', {
//                headers: { Authorization: `Bearer ${token}` },
//            })
//            .then((response) => setRankings(response.data))
//            .catch((error) => console.error('Error fetching rankings:', error));
//    }, []);
//
//    const handleRankingChange = (e) => {
//        const rankingId = e.target.value;
//        setSelectedRanking(rankingId);
//
//        if (rankingId) {
//            // Pobieranie użytkowników dla wybranego rankingu
//            const token = localStorage.getItem('jwtToken');
//            axios
//                .get(`http://localhost:8080/api/ranking-points/${rankingId}`, {
//                    headers: { Authorization: `Bearer ${token}` },
//                })
//                .then((response) => {
//                    const sortedUsers = response.data.sort((a, b) => b.points - a.points);
//                    setUsers(sortedUsers);
//                })
//                .catch((error) => console.error('Error fetching ranking users:', error));
//        } else {
//            setUsers([]);
//        }
//    };
//
//    return (
//        <Container className="mt-4">
//            <h2>Ranking</h2>
//            <Form>
//                <Form.Group>
//                    <Form.Label>Wybierz ranking</Form.Label>
//                    <Form.Select value={selectedRanking} onChange={handleRankingChange}>
//                        <option value="">-- Wybierz --</option>
//                        {rankings.map((ranking) => (
//                            <option key={ranking.id} value={ranking.id}>
//                                {ranking.name}
//                            </option>
//                        ))}
//                    </Form.Select>
//                </Form.Group>
//            </Form>
//            <ListGroup className="mt-4">
//                {users.map((user) => (
//                    <ListGroup.Item key={user.id}>
//                        {user.userName} - {user.points} points
//                    </ListGroup.Item>
//                ))}
//            </ListGroup>
//        </Container>
//    );
//};
//
//export default RankingView;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, ListGroup } from "react-bootstrap";
//import jwtDecode from 'jwt-decode'; //Dodana biblioteka `npm install jwt-decode`
import { jwtDecode } from "jwt-decode";

const RankingView = () => {
  const [rankings, setRankings] = useState([]);
  const [selectedRanking, setSelectedRanking] = useState("");
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loggedInUser, setLoggedInUser] = useState("");

  useEffect(() => {
    // Pobieranie nazwy zalogowanego użytkownika z JWT
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setLoggedInUser(decodedToken.sub);
    }

    // Pobieranie listy rankingów
    axios
      .get("http://localhost:8080/api/rankings", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setRankings(response.data))
      .catch((error) => console.error("Error fetching rankings:", error));
  }, []);

  const handleRankingChange = (e) => {
    const rankingId = e.target.value;
    setSelectedRanking(rankingId);

    if (rankingId) {
      const token = localStorage.getItem("jwtToken");
      axios
        .get(`http://localhost:8080/api/ranking-points/${rankingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const sortedUsers = response.data.sort((a, b) => b.points - a.points);
          setUsers(sortedUsers);
        })
        .catch((error) =>
          console.error("Error fetching ranking users:", error),
        );
    } else {
      setUsers([]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredUsers = users.filter((user) =>
    user.userName.toLowerCase().includes(searchQuery),
  );

  return (
    <Container className="mt-4">
      <h2>Ranking</h2>
      <Form>
        <Form.Group>
          <Form.Label>Select ranking</Form.Label>
          <Form.Select value={selectedRanking} onChange={handleRankingChange}>
            <option value="">-- Select --</option>
            {rankings.map((ranking) => (
              <option key={ranking.id} value={ranking.id}>
                {ranking.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>Search for user</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search username"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Form.Group>
      </Form>
      <ListGroup className="mt-4">
        {filteredUsers.map((user) => (
          <ListGroup.Item
            key={user.id}
            style={{
              backgroundColor:
                user.userName === loggedInUser ? "#d3f9d8" : "white",
            }}
          >
            {user.userName} - {user.points} points
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default RankingView;
