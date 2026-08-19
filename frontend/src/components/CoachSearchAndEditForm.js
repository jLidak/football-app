import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import UsePagination from "./UsePagination";
import PaginationComponent from "./PaginationComponent";

const CoachSearchAndEditForm = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [coaches, setCoaches] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [noResultsMessage, setNoResultsMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nickname: "",
    countryName: "",
  });
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    currentResults,
    handlePageChange,
  } = UsePagination(coaches, 10);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    //Wyświetlanie wszystkich rekordów odrazu po wejściu w widok, przed naciśnięciem "Search"
    // axios.get(`http://localhost:8080/api/coaches`, {
    //     headers: { Authorization: `Bearer ${token}` }
    // })
    //     .then(response => {
    //         setCoaches(response.data);
    //         setCurrentPage(1);
    //         setErrorMessage('');
    //         setNoResultsMessage(response.data.length === 0 ? 'No results found.' : '');
    //     })
    //     .catch(error => console.error('Error fetching coaches:', error));

    axios
      .get("http://localhost:8080/api/countries", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setCountries(response.data))
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    //Wyświetlanie błędu przy próbie wyszukania pustej wartości
    // if (!searchQuery.trim()) {
    //     setCoaches([]);
    //     setErrorMessage('You are trying to search for an empty value.');
    //     setNoResultsMessage('');
    //     return;
    // }

    axios
      .get(`http://localhost:8080/api/coaches/search?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCoaches(response.data);
        setCurrentPage(1);
        setErrorMessage("");
        setNoResultsMessage(
          response.data.length === 0 ? "No results found." : "",
        );
      })
      .catch((error) => console.error("Error fetching coaches:", error));
  };

  const handleEditClick = (coach) => {
    setSelectedCoach(coach.id);
    setEditData({
      firstName: coach.firstName,
      lastName: coach.lastName,
      dateOfBirth: coach.dateOfBirth,
      nickname: coach.nickname,
      countryName: coach.country.name,
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    axios
      .put(`http://localhost:8080/api/coaches/${selectedCoach}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Coach updated successfully");
        setSelectedCoach(null);
        handleSearch(e); // Refresh coach list after editing
      })
      .catch((error) => {
        console.error("Error updating coach:", error);
        alert("Failed to update coach");
      });
  };

  const handleDeleteCoach = (coachId) => {
    const token = localStorage.getItem("jwtToken");

    axios
      .delete(`http://localhost:8080/api/coaches/${coachId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Coach deleted successfully");
        setCoaches(coaches.filter((coach) => coach.id !== coachId)); // Remove coach from list
      })
      .catch((error) => {
        console.error("Error deleting coach:", error);
        alert("Failed to delete coach");
      });
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Search Coach</h1>
      <Form
        onSubmit={handleSearch}
        className="d-flex justify-content-center mb-4"
      >
        <Form.Control
          type="text"
          placeholder="Enter coach name or nickname"
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
          <h3 className="text-center mb-3">Coaches found:</h3>
          <Container>
            {currentResults.map((coach) => (
              <React.Fragment key={coach.id}>
                <Card className="mb-3 shadow-sm">
                  <Card.Body
                    className="d-flex justify-content-between align-items-center"
                    style={{ textAlign: "left" }}
                  >
                    <div>
                      <strong>ID:</strong> {coach.id}
                      <br />
                      <strong>Name:</strong> {coach.firstName} {coach.lastName}{" "}
                      ({coach.nickname})<br />
                      <strong>Date of Birth:</strong> {coach.dateOfBirth}
                      <br />
                      <strong>Country:</strong> {coach.country.name}
                    </div>
                    <div>
                      <Button
                        variant="outline-primary"
                        onClick={() => handleEditClick(coach)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        className="ms-2"
                        onClick={() => handleDeleteCoach(coach.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>

                {selectedCoach === coach.id && (
                  <div className="p-4 border rounded shadow-sm bg-light mb-3">
                    <h3 className="text-center">
                      Edit Coach: {coach.firstName} {coach.lastName}
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
                      <Form.Group controlId="formCountry" className="mb-3">
                        <Form.Label>Country</Form.Label>
                        <Form.Select
                          value={editData.countryName}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              countryName: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Country</option>
                          {countries.map((country) => (
                            <option key={country.id} value={country.name}>
                              {country.name}
                            </option>
                          ))}
                        </Form.Select>
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

          <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </Container>
  );
};

export default CoachSearchAndEditForm;
