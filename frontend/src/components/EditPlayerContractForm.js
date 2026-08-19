import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, ListGroup, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import UsePagination from "./UsePagination";
import PaginationComponent from "./PaginationComponent";

const EditPlayerContractForm = () => {
  const [searchType, setSearchType] = useState("player");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [salary, setSalary] = useState("");
  const [transferFee, setTransferFee] = useState("");
  const [transferType, setTransferType] = useState("");
  const [noResultsMessage, setNoResultsMessage] = useState("");
  const [selectedSuggestionMessage, setSelectedSuggestionMessage] =
    useState("");

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    currentResults,
    handlePageChange,
  } = UsePagination(contracts, 10);

  useEffect(() => {
    if (searchQuery) {
      if (
        selectedSuggestion &&
        searchQuery !==
          (searchType === "player"
            ? `${selectedSuggestion.firstName} ${selectedSuggestion.lastName}`
            : selectedSuggestion.name)
      ) {
        setSelectedSuggestion(null);
        setSelectedContract(null);
      }

      const token = localStorage.getItem("jwtToken");
      const url =
        searchType === "player"
          ? `http://localhost:8080/api/players/search?query=${searchQuery}`
          : `http://localhost:8080/api/teams/search?query=${searchQuery}`;

      axios
        .get(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setSuggestions(response.data))
        .catch((error) => console.error("Error fetching suggestions:", error));
    } else {
      setSuggestions([]);
      setContracts([]);
      setNoResultsMessage("");
      setSelectedSuggestionMessage("");
    }
  }, [searchQuery, searchType, selectedSuggestion]);

  const handleSelectSuggestion = (item) => {
    const itemName =
      searchType === "player"
        ? `${item.firstName} ${item.lastName}`
        : item.name;

    setSelectedSuggestion(item);
    setSearchQuery(itemName);
    setSuggestions([]);
    setSelectedContract(null);
    setSelectedSuggestionMessage(`Contracts of ${itemName}:`);

    const token = localStorage.getItem("jwtToken");
    const url =
      searchType === "player"
        ? `http://localhost:8080/api/player-contracts/player/${item.id}`
        : `http://localhost:8080/api/player-contracts/team/${item.id}`;

    axios
      .get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setContracts(response.data);
        setCurrentPage(1);
        setNoResultsMessage(
          response.data.length === 0 ? "No contracts found." : "",
        );
      })
      .catch((error) => {
        console.error("Error fetching contracts:", error);
        setNoResultsMessage("Error fetching contracts.");
      });
  };

  const handleContractSelect = (contract) => {
    setSelectedContract(contract);
    setStartDate(contract.startDate);
    setEndDate(contract.endDate);
    setSalary(contract.salary || "");
    setTransferFee(contract.transferFee || "");
    setTransferType(contract.transferType);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    const updatedContract = {
      startDate,
      endDate,
      salary: salary || null,
      transferFee: transferType === "TRANSFER" ? transferFee : null,
      transferType,
    };

    axios
      .put(
        `http://localhost:8080/api/player-contracts/${selectedContract.id}`,
        updatedContract,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        alert("Player contract updated successfully");
        handleSelectSuggestion(selectedSuggestion);
        setSelectedContract(null);
      })
      .catch((error) => console.error("Error updating contract:", error));
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchQuery("");
    setSuggestions([]);
    setContracts([]);
    setSelectedSuggestion(null);
    setNoResultsMessage("");
    setSelectedSuggestionMessage("");
    setSelectedContract(null);
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Edit Player Contracts</h1>

      <Form className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Search Type</Form.Label>
          <Form.Select value={searchType} onChange={handleSearchTypeChange}>
            <option value="player">Player</option>
            <option value="team">Team</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder={`Enter ${searchType === "player" ? "player" : "team"} name`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Form.Group>

        {suggestions.length > 0 && !selectedSuggestion && (
          <ListGroup className="mb-3">
            {suggestions.map((item) => (
              <ListGroup.Item
                key={item.id}
                onClick={() => handleSelectSuggestion(item)}
                style={{ cursor: "pointer" }}
              >
                {searchType === "player"
                  ? `${item.firstName} ${item.lastName}`
                  : item.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Form>

      {selectedSuggestion && (
        <div>
          <p
            className="text-center"
            style={{ fontSize: "20px", fontWeight: "bold" }}
          >
            {selectedSuggestionMessage}
          </p>
          <Container>
            {currentResults.length > 0 &&
              currentResults.map((contract) => (
                <React.Fragment key={contract.id}>
                  <Card className="mb-3 shadow-sm">
                    <Card.Body
                      className="d-flex justify-content-between align-items-center"
                      style={{ textAlign: "left" }}
                    >
                      <div>
                        <strong>Player:</strong> {contract.player.firstName}{" "}
                        {contract.player.lastName}
                        <br />
                        <strong>Team:</strong> {contract.team.name}
                        <br />
                        <strong>Start Date:</strong> {contract.startDate}
                        <br />
                        <strong>End Date:</strong> {contract.endDate}
                        <br />
                        <strong>Salary:</strong>{" "}
                        {contract.salary || "Not specified"}
                        <br />
                        <strong>Transfer Type:</strong> {contract.transferType}
                        <br />
                        {contract.transferType === "TRANSFER" && (
                          <>
                            <strong>Transfer Fee:</strong>{" "}
                            {contract.transferFee || "Not specified"}
                          </>
                        )}
                      </div>
                      <div>
                        <Button
                          variant="outline-primary"
                          onClick={() => handleContractSelect(contract)}
                          className="me-2"
                        >
                          Edit
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>

                  {selectedContract && selectedContract.id === contract.id && (
                    <div className="p-4 border rounded shadow-sm bg-light mb-3">
                      <h3 className="text-center mb-4">Edit Contract</h3>
                      <Form onSubmit={handleEditSubmit}>
                        <Form.Group controlId="formStartDate" className="mb-3">
                          <Form.Label>Start Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                          />
                        </Form.Group>
                        <Form.Group controlId="formEndDate" className="mb-3">
                          <Form.Label>End Date (optional)</Form.Label>
                          <Form.Control
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate}
                          />
                        </Form.Group>
                        <Form.Group controlId="formSalary" className="mb-3">
                          <Form.Label>Salary (optional)</Form.Label>
                          <Form.Control
                            type="number"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            min="0"
                          />
                        </Form.Group>
                        <Form.Group
                          controlId="formTransferType"
                          className="mb-3"
                        >
                          <Form.Label>Transfer Type</Form.Label>
                          <Form.Select
                            value={transferType}
                            onChange={(e) => setTransferType(e.target.value)}
                            required
                          >
                            <option value="">Select transfer type</option>
                            <option value="LOAN">Loan</option>
                            <option value="TRANSFER">Transfer</option>
                            <option value="END_LOAN">End of Loan</option>
                          </Form.Select>
                        </Form.Group>
                        {transferType === "TRANSFER" && (
                          <Form.Group
                            controlId="formTransferFee"
                            className="mb-3"
                          >
                            <Form.Label>Transfer Fee</Form.Label>
                            <Form.Control
                              type="number"
                              value={transferFee}
                              onChange={(e) => setTransferFee(e.target.value)}
                              min="0"
                            />
                          </Form.Group>
                        )}
                        <Button
                          variant="primary"
                          type="submit"
                          className="w-100"
                        >
                          Save Changes
                        </Button>
                      </Form>
                    </div>
                  )}
                </React.Fragment>
              ))}
          </Container>

          {noResultsMessage && (
            <p className="text-center text-muted">{noResultsMessage}</p>
          )}

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

export default EditPlayerContractForm;
