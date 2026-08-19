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
import "../App.css";
import UsePagination from "./UsePagination";
import PaginationComponent from "./PaginationComponent";

const LeagueSearchAndEditForm = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [leagues, setLeagues] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [noResultsMessage, setNoResultsMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editData, setEditData] = useState({
    name: "",
    countryName: "",
    edition: "",
  });
  const [isEditionValid, setIsEditionValid] = useState(true);
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    currentResults,
    handlePageChange,
  } = UsePagination(leagues, 10);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    //Wyświetlanie wszystkich rekordów odrazu po wejściu w widok, przed naciśnięciem "Search"
    // axios.get(`http://localhost:8080/api/leagues`, {
    //     headers: { Authorization: `Bearer ${token}` }
    // })
    //     .then(response => {
    //         setLeagues(response.data);
    //         setCurrentPage(1);
    //         setErrorMessage('');
    //         setNoResultsMessage(response.data.length === 0 ? 'No results found.' : '');
    //     })
    //     .catch(error => console.error('Error fetching leagues:', error));

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
    //     setLeagues([]);
    //     setErrorMessage('You are trying to search for an empty value.');
    //     setNoResultsMessage('');
    //     return;
    // }

    axios
      .get(`http://localhost:8080/api/leagues/search?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setLeagues(response.data);
        setCurrentPage(1);
        setErrorMessage("");
        setNoResultsMessage(
          response.data.length === 0 ? "No results found." : "",
        );
      })
      .catch((error) => console.error("Error fetching leagues:", error));
  };

  const handleEditClick = (league) => {
    setSelectedLeague(league.id);
    setEditData({
      name: league.name,
      countryName: league.country.name,
      edition: league.edition || "",
    });
  };

  const handleEditionChange = (e) => {
    const value = e.target.value;
    setEditData({ ...editData, edition: value });

    const editionPattern = /^(?:\d{4}\/\d{4}|\d{4})$/;
    setIsEditionValid(editionPattern.test(value));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    if (!isEditionValid) {
      alert(
        'Edycja musi być w formacie "rok/rok+1" (np. 2024/2025) lub "rok" (np. 2025).\n',
      );
      return;
    }

    const token = localStorage.getItem("jwtToken");
    const selectedCountry = countries.find(
      (country) => country.name === editData.countryName,
    );
    const countryId = selectedCountry ? selectedCountry.id : null;

    const updatedData = {
      ...editData,
      countryId,
    };

    axios
      .put(`http://localhost:8080/api/leagues/${selectedLeague}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("League updated successfully");
        setSelectedLeague(null);
      })
      .catch((error) => {
        console.error("Error updating league:", error);
        alert("Failed to update league");
      });
  };

  const handleDeleteLeague = (leagueId) => {
    const token = localStorage.getItem("jwtToken");

    axios
      .delete(`http://localhost:8080/api/leagues/${leagueId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("League deleted successfully");
        setLeagues(leagues.filter((league) => league.id !== leagueId));
      })
      .catch((error) => {
        console.error("Error deleting league:", error);
        alert("Failed to delete league");
      });
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Search League</h1>
      <Form
        onSubmit={handleSearch}
        className="d-flex justify-content-center mb-4"
      >
        <Form.Control
          type="text"
          placeholder="Enter league name"
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
          <h3 className="text-center mb-3">Leagues found:</h3>
          <Container>
            {currentResults.map((league) => (
              <React.Fragment key={league.id}>
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
                          <img
                            src={`/assets/flags/${league.country.code}.svg`}
                            alt={league.country.name}
                            className="league-picture"
                          />
                        </div>
                      </Col>
                      <Col style={{ textAlign: "left" }}>
                        <div>
                          <strong>ID:</strong> {league.id}
                          <br />
                          <strong>Name:</strong> {league.name}
                          <br />
                          <strong>Country:</strong> {league.country.name}
                        </div>
                      </Col>
                      <Col xs="auto" className="d-flex justify-content-end">
                        <Button
                          variant="outline-primary"
                          onClick={() => handleEditClick(league)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          className="ms-2"
                          onClick={() => handleDeleteLeague(league.id)}
                        >
                          Delete
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {selectedLeague === league.id && (
                  <div className="p-4 border rounded shadow-sm bg-light mb-3">
                    <h3 className="text-center mb-4">
                      Edit League: {league.name}
                    </h3>
                    <Form onSubmit={handleEditSubmit}>
                      <Form.Group controlId="formLeagueName" className="mb-3">
                        <Form.Label>League Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          required
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
                      <Form.Group controlId="formEdition" className="mb-3">
                        <Form.Label>Edition (e.g., 23/24)</Form.Label>
                        <Form.Control
                          type="text"
                          value={editData.edition}
                          onChange={handleEditionChange}
                          placeholder="Enter edition"
                          isInvalid={!isEditionValid}
                        />
                        <Form.Control.Feedback type="invalid">
                          Edycja musi być w formacie "rok/rok+1" (np. 2024/2025)
                          lub "rok" (np. 2025).
                        </Form.Control.Feedback>
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

export default LeagueSearchAndEditForm;
