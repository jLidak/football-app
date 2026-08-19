//import React, { useState, useEffect } from 'react';
//import axios from 'axios';
//import { Form, Button, Container, ListGroup } from 'react-bootstrap';
//
//
//const EditRankingForm = ({ rankingId, onClose }) => {
//    const [name, setName] = useState('');
//    const [startDate, setStartDate] = useState('');
//    const [endDate, setEndDate] = useState('');
//    const [message, setMessage] = useState('');
//
//    useEffect(() => {
//        if (rankingId) {
//            const token = localStorage.getItem('jwtToken');
//
//            // Pobranie szczegółów rankingu
//            axios
//                .get(`http://localhost:8080/api/rankings/${rankingId}`, {
//                    headers: { Authorization: `Bearer ${token}` },
//                })
//                .then((response) => {
//                    const ranking = response.data;
//                    setName(ranking.name);
//                    setStartDate(ranking.startDate);
//                    setEndDate(ranking.endDate);
//                })
//                .catch((error) => console.error('Error fetching ranking details:', error));
//        }
//    }, [rankingId]);
//
//    const handleSubmit = (e) => {
//        e.preventDefault();
//        const token = localStorage.getItem('jwtToken');
//
//        const updatedRanking = {
//            name: name,
//            startDate: startDate,
//            endDate: endDate,
//        };
//
//        axios
//            .put(`http://localhost:8080/api/rankings/${rankingId}/edit`, updatedRanking, {
//                headers: { Authorization: `Bearer ${token}` },
//            })
//            .then(() => {
//                alert('Ranking updated successfully!');
//                setMessage('Ranking został zaktualizowany.');
//                if (onClose) onClose();
//            })
//            .catch((error) => {
//                console.error('Error updating ranking:', error);
//                setMessage('Błąd podczas aktualizacji rankingu.');
//            });
//    };
//
//    if (!rankingId) {
//        return <p>Brak wybranego rankingu do edycji.</p>;
//    }
//
//    return (
//        <div className="container mt-4">
//            <h2>Edytuj Ranking</h2>
//            <form onSubmit={handleSubmit}>
//                <div className="form-group">
//                    <label>Nazwa</label>
//                    <input
//                        type="text"
//                        className="form-control"
//                        value={name}
//                        onChange={(e) => setName(e.target.value)}
//                        required
//                    />
//                </div>
//                <div className="form-group">
//                    <label>Data rozpoczęcia</label>
//                    <input
//                        type="date"
//                        className="form-control"
//                        value={startDate}
//                        onChange={(e) => setStartDate(e.target.value)}
//                        required
//                    />
//                </div>
//                <div className="form-group">
//                    <label>Data zakończenia</label>
//                    <input
//                        type="date"
//                        className="form-control"
//                        value={endDate}
//                        onChange={(e) => setEndDate(e.target.value)}
//                        required
//                    />
//                </div>
//                <button type="submit" className="btn btn-primary mt-3">
//                    Zapisz zmiany
//                </button>
//                <button
//                    type="button"
//                    className="btn btn-secondary mt-3 ms-2"
//                    onClick={onClose}
//                >
//                    Anuluj
//                </button>
//            </form>
//            {message && <div className="alert alert-info mt-3">{message}</div>}
//        </div>
//    );
//};
//
//export default EditRankingForm;

//import React, { useState, useEffect } from 'react';
//import axios from 'axios';
//
//const EditRankingForm = ({ onClose }) => {
//    const [rankings, setRankings] = useState([]);
//    const [selectedRankingId, setSelectedRankingId] = useState('');
//    const [name, setName] = useState('');
//    const [startDate, setStartDate] = useState('');
//    const [endDate, setEndDate] = useState('');
//    const [message, setMessage] = useState('');
//
//    useEffect(() => {
//        const token = localStorage.getItem('jwtToken');
//
//        // Pobranie listy rankingów
//        axios
//            .get('http://localhost:8080/api/rankings', {
//                headers: { Authorization: `Bearer ${token}` },
//            })
//            .then((response) => {
//                setRankings(response.data);
//            })
//            .catch((error) => console.error('Error fetching rankings:', error));
//    }, []);
//
//    useEffect(() => {
//        if (selectedRankingId) {
//            const token = localStorage.getItem('jwtToken');
//
//            // Pobranie szczegółów wybranego rankingu
//            axios
//                .get(`http://localhost:8080/api/rankings/${selectedRankingId}`, {
//                    headers: { Authorization: `Bearer ${token}` },
//                })
//                .then((response) => {
//                    const ranking = response.data;
//                    setName(ranking.name);
//                    setStartDate(ranking.startDate);
//                    setEndDate(ranking.endDate);
//                })
//                .catch((error) => console.error('Error fetching ranking details:', error));
//        }
//    }, [selectedRankingId]);
//
//    const handleSubmit = (e) => {
//        e.preventDefault();
//        const token = localStorage.getItem('jwtToken');
//
//        const updatedRanking = {
//            name: name,
//            startDate: startDate,
//            endDate: endDate,
//        };
//
//        axios
//            .put(`http://localhost:8080/api/rankings/${selectedRankingId}/edit`, updatedRanking, {
//                headers: { Authorization: `Bearer ${token}` },
//            })
//            .then(() => {
//                alert('Ranking updated successfully!');
//                setMessage('Ranking został zaktualizowany.');
//                if (onClose) onClose();
//            })
//            .catch((error) => {
//                console.error('Error updating ranking:', error);
//                setMessage('Błąd podczas aktualizacji rankingu.');
//            });
//    };
//
//    return (
//        <div className="container mt-4">
//            <h2>Edytuj Ranking</h2>
//            <form>
//                <div className="form-group">
//                    <label>Wybierz Ranking</label>
//                    <select
//                        className="form-control"
//                        value={selectedRankingId}
//                        onChange={(e) => setSelectedRankingId(e.target.value)}
//                    >
//                        <option value="">-- Wybierz --</option>
//                        {rankings.map((ranking) => (
//                            <option key={ranking.id} value={ranking.id}>
//                                {ranking.name}
//                            </option>
//                        ))}
//                    </select>
//                </div>
//            </form>
//            {selectedRankingId && (
//                <form onSubmit={handleSubmit} className="mt-4">
//                    <div className="form-group">
//                        <label>Nazwa</label>
//                        <input
//                            type="text"
//                            className="form-control"
//                            value={name}
//                            onChange={(e) => setName(e.target.value)}
//                            required
//                        />
//                    </div>
//                    <div className="form-group">
//                        <label>Data rozpoczęcia</label>
//                        <input
//                            type="date"
//                            className="form-control"
//                            value={startDate}
//                            onChange={(e) => setStartDate(e.target.value)}
//                            required
//                        />
//                    </div>
//                    <div className="form-group">
//                        <label>Data zakończenia</label>
//                        <input
//                            type="date"
//                            className="form-control"
//                            value={endDate}
//                            onChange={(e) => setEndDate(e.target.value)}
//                            required
//                        />
//                    </div>
//                    <button type="submit" className="btn btn-primary mt-3">
//                        Zapisz zmiany
//                    </button>
//                    <button
//                        type="button"
//                        className="btn btn-secondary mt-3 ms-2"
//                        onClick={onClose}
//                    >
//                        Anuluj
//                    </button>
//                </form>
//            )}
//            {message && <div className="alert alert-info mt-3">{message}</div>}
//        </div>
//    );
//};
//
//export default EditRankingForm;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container } from "react-bootstrap";

const EditRankingForm = ({ onClose }) => {
  const [rankings, setRankings] = useState([]);
  const [selectedRankingId, setSelectedRankingId] = useState("");
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    // Pobranie listy rankingów
    axios
      .get("http://localhost:8080/api/rankings", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setRankings(response.data))
      .catch((error) => console.error("Error fetching rankings:", error));
  }, []);

  const handleRankingChange = (e) => {
    const rankingId = e.target.value;
    setSelectedRankingId(rankingId);

    if (rankingId) {
      const token = localStorage.getItem("jwtToken");

      // Pobranie szczegółów wybranego rankingu
      axios
        .get(`http://localhost:8080/api/rankings/${rankingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const ranking = response.data;
          setName(ranking.name);
          setStartDate(ranking.startDate);
          setEndDate(ranking.endDate);
        })
        .catch((error) =>
          console.error("Error fetching ranking details:", error),
        );
    } else {
      setName("");
      setStartDate("");
      setEndDate("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    const updatedRanking = {
      name,
      startDate,
      endDate,
    };

    axios
      .put(
        `http://localhost:8080/api/rankings/${selectedRankingId}/edit`,
        updatedRanking,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        alert("Ranking updated successfully!");
        setMessage("Ranking został zaktualizowany.");
        if (onClose) onClose();
      })
      .catch((error) => {
        console.error("Error updating ranking:", error);
        setMessage("Błąd podczas aktualizacji rankingu.");
      });
  };

  return (
    <Container className="mt-4">
      <h2>Edytuj Ranking</h2>
      <Form>
        <Form.Group>
          <Form.Label>Wybierz Ranking</Form.Label>
          <Form.Select value={selectedRankingId} onChange={handleRankingChange}>
            <option value="">-- Wybierz Ranking --</option>
            {rankings.map((ranking) => (
              <option key={ranking.id} value={ranking.id}>
                {ranking.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Form>
      {selectedRankingId && (
        <Form onSubmit={handleSubmit} className="mt-3">
          <Form.Group>
            <Form.Label>Nazwa</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Data rozpoczęcia</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Data zakończenia</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" className="btn btn-primary mt-3">
            Zapisz zmiany
          </Button>
          <Button
            type="button"
            className="btn btn-secondary mt-3 ms-2"
            onClick={onClose}
          >
            Anuluj
          </Button>
        </Form>
      )}
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </Container>
  );
};

export default EditRankingForm;
