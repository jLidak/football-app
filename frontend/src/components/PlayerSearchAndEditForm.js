import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import PlayerImage from "./PlayerImage";
import UsePagination from "./UsePagination";
import PaginationComponent from "./PaginationComponent";

const PlayerSearchAndEditForm = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [players, setPlayers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [noResultsMessage, setNoResultsMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nickname: "",
    positionId: "",
    countryId: "",
    value: "",
  });
  const [pictureFile, setPictureFile] = useState(null);
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    currentResults,
    handlePageChange,
  } = UsePagination(players, 10);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    //Wyświetlanie wszystkich rekordów odrazu po wejściu w widok, przed naciśnięciem "Search"
    // axios.get(`http://localhost:8080/api/players`, {
    //     headers: { Authorization: `Bearer ${token}` }
    // })
    //     .then(response => {
    //         setPlayers(response.data);
    //         setCurrentPage(1);
    //         setErrorMessage('');
    //         setNoResultsMessage(response.data.length === 0 ? 'No results found.' : '');
    //     })
    //     .catch(error => console.error('Error fetching players:', error));

    axios
      .get("http://localhost:8080/api/positions", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPositions(res.data))
      .catch((error) => console.error("Error fetching positions:", error));

    axios
      .get("http://localhost:8080/api/countries")
      .then((res) => setCountries(res.data))
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    //Wyświetlanie błędu przy próbie wyszukania pustej wartości
    // if (!searchQuery.trim()) {
    //     setPlayers([]);
    //     setErrorMessage('You are trying to search for an empty value.');
    //     setNoResultsMessage('');
    //     return;
    // }

    axios
      .get(`http://localhost:8080/api/players/search?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setPlayers(response.data);
        setCurrentPage(1);
        setErrorMessage("");
        setNoResultsMessage(
          response.data.length === 0 ? "No results found." : "",
        );
      })
      .catch((error) => console.error("Error fetching players:", error));
  };

  const handleEditClick = (player) => {
    setSelectedPlayerId(player.id);
    setEditData({
      firstName: player.firstName,
      lastName: player.lastName,
      dateOfBirth: player.dateOfBirth,
      nickname: player.nickname,
      positionId: player.position.id,
      countryId: player.country.id,
      value: player.value,
    });
    setPictureFile(null);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    const formData = new FormData();
    formData.append("firstName", editData.firstName);
    formData.append("lastName", editData.lastName);
    formData.append("dateOfBirth", editData.dateOfBirth);
    formData.append("nickname", editData.nickname);
    formData.append("positionId", editData.positionId);
    formData.append("countryId", editData.countryId);
    formData.append("value", editData.value);

    if (pictureFile) {
      formData.append("picture", pictureFile);
    }

    axios
      .put(`http://localhost:8080/api/players/${selectedPlayerId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Player updated successfully");
        setSelectedPlayerId(null);
      })
      .catch((error) => {
        console.error("Error updating player:", error);
        alert("Failed to update player");
      });
  };

  const handleDeletePlayer = (playerId) => {
    const token = localStorage.getItem("jwtToken");

    axios
      .delete(`http://localhost:8080/api/players/${playerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Player deleted successfully");
        setPlayers(players.filter((player) => player.id !== playerId));
      })
      .catch((error) => {
        console.error("Error deleting player:", error);
        alert("Failed to delete player");
      });
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Search Player</h1>
      <Form
        onSubmit={handleSearch}
        className="d-flex justify-content-center mb-4"
      >
        <Form.Control
          type="text"
          placeholder="Enter first or last name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="me-2"
          style={{ maxWidth: "400px" }}
        />
        <Button variant="primary" type="submit">
          Search
        </Button>
      </Form>

      {errorMessage && (
        <Alert variant="danger" className="text-center">
          {errorMessage}
        </Alert>
      )}

      {noResultsMessage && (
        <p className="text-center text-muted">{noResultsMessage}</p>
      )}

      {currentResults.length > 0 && (
        <div className="mb-4">
          <h3 className="text-center mb-3">Players found:</h3>
          <Container>
            {currentResults.map((player) => (
              <React.Fragment key={player.id}>
                <Card className="mb-3 shadow-sm">
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col xs="auto">
                        <div
                          style={{
                            display: "inline-block",
                            backgroundColor: "#f0f0f0",
                            padding: "6px",
                            borderRadius: "4px",
                            boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          <PlayerImage player={player} />
                        </div>
                      </Col>
                      <Col style={{ textAlign: "left" }}>
                        <div>
                          <strong>ID:</strong> {player.id}
                          <br />
                          <strong>Name:</strong> {player.firstName}{" "}
                          {player.lastName}
                          <br />
                          <strong>Position:</strong>{" "}
                          {player.position.abbreviation}
                          <br />
                          <strong>Country:</strong> {player.country.name}
                          <br />
                          <strong>Nickname:</strong> {player.nickname || "N/A"}
                          <br />
                          <strong>Value:</strong> $
                          {player.value ? player.value.toFixed(2) : "0.00"}
                          <br />
                          <strong>Date of Birth:</strong> {player.dateOfBirth}
                        </div>
                      </Col>
                      <Col xs="auto" className="d-flex justify-content-end">
                        <Button
                          variant="outline-primary"
                          onClick={() => handleEditClick(player)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => handleDeletePlayer(player.id)}
                          className="ms-2"
                        >
                          Delete
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {selectedPlayerId === player.id && (
                  <div className="p-4 border rounded shadow-sm bg-light mb-3">
                    <h3 className="text-center mb-4">
                      Edit Player: {player.firstName} {player.lastName}
                    </h3>
                    <Form onSubmit={handleEditSubmit}>
                      <Form.Group controlId="formFirstName" className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={editData.firstName}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                      <Form.Group controlId="formLastName" className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={editData.lastName}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              lastName: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                      <Form.Group controlId="formDateOfBirth" className="mb-3">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control
                          type="date"
                          value={editData.dateOfBirth}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              dateOfBirth: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                      <Form.Group controlId="formNickname" className="mb-3">
                        <Form.Label>Nickname</Form.Label>
                        <Form.Control
                          type="text"
                          value={editData.nickname}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              nickname: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                      <Form.Group controlId="formPicture" className="mb-3">
                        <Form.Label>Upload Picture</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={(e) => setPictureFile(e.target.files[0])}
                        />
                      </Form.Group>
                      <Form.Group controlId="formPosition" className="mb-3">
                        <Form.Label>Position</Form.Label>
                        <Form.Select
                          value={editData.positionId}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              positionId: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Position</option>
                          {positions.map((position) => (
                            <option key={position.id} value={position.id}>
                              {position.abbreviation}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group controlId="formCountry" className="mb-3">
                        <Form.Label>Country</Form.Label>
                        <Form.Select
                          value={editData.countryId}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              countryId: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Country</option>
                          {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                              {country.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group controlId="formValue" className="mb-3">
                        <Form.Label>Value</Form.Label>
                        <Form.Control
                          type="number"
                          value={editData.value}
                          onChange={(e) =>
                            setEditData({ ...editData, value: e.target.value })
                          }
                        />
                      </Form.Group>
                      <Button variant="primary" type="submit" className="w-100">
                        Save Changes
                      </Button>
                    </Form>
                  </div>
                )}
              </React.Fragment>
            ))}
          </Container>
        </div>
      )}
    </Container>
  );
};

export default PlayerSearchAndEditForm;
