import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  ToggleButtonGroup,
  ToggleButton,
  Accordion,
  Alert,
  ListGroup,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const AddInjuryForm = () => {
  const [importMode, setImportMode] = useState(false);
  const [fileType, setFileType] = useState("");
  const [file, setFile] = useState(null);
  const [injuryType, setInjuryType] = useState("");
  const [injuryStartDate, setInjuryStartDate] = useState("");
  const [injuryEndDate, setInjuryEndDate] = useState("");
  const [playerSearchQuery, setPlayerSearchQuery] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const [duplicateRecords, setDuplicateRecords] = useState([]);

  const resetForm = () => {
    setInjuryType("");
    setInjuryStartDate("");
    setInjuryEndDate("");
    setPlayerSearchQuery("");
    setFilteredPlayers([]);
    setSelectedPlayer(null);
    setFileType("");
    setFile(null);
    setDuplicateRecords([]);
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (playerSearchQuery) {
      if (
        selectedPlayer &&
        playerSearchQuery !==
          `${selectedPlayer.firstName} ${selectedPlayer.lastName}`
      ) {
        setSelectedPlayer(null); // Resetuj wybranego gracza, jeśli query się zmieni
      }

      const token = localStorage.getItem("jwtToken");
      axios
        .get(
          `http://localhost:8080/api/players/search?query=${playerSearchQuery}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then((response) => setFilteredPlayers(response.data))
        .catch((error) => console.error("Error fetching players:", error));
    } else {
      setFilteredPlayers([]);
      setSelectedPlayer(null); // Resetuj wybranego gracza, jeśli query jest puste
    }
  }, [playerSearchQuery, selectedPlayer]);

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player);
    setPlayerSearchQuery(`${player.firstName} ${player.lastName}`);
    setFilteredPlayers([]); // Ukryj listę wyników po wyborze gracza
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      console.error("Authorization token is missing");
      return;
    }

    if (!importMode) {
      const injuryData = {
        playerId: selectedPlayer?.id,
        type: injuryType,
        startDate: injuryStartDate,
        endDate: injuryEndDate,
      };

      axios
        .post("http://localhost:8080/api/injuries/add", injuryData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          alert("Injury added successfully");
          resetForm();
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            setAlertMessage(error.response.data);
          } else {
            setAlertMessage("Error adding injury");
          }
        });
    } else {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", fileType);

      axios
        .post("http://localhost:8080/api/injuries/import", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          alert(response.data);
          setDuplicateRecords(response.data.duplicates || []);
          resetForm();
        })
        .catch((error) => {
          console.error("Error importing injuries:", error);
          alert(error.response?.data || "Failed to import injuries");
          setDuplicateRecords(error.response?.data?.duplicates || []);
        });
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">
        {importMode ? "Import Injuries" : "Add Injury"}
      </h1>
      {alertMessage && (
        <Alert
          variant="danger"
          onClose={() => setAlertMessage(null)}
          dismissible
        >
          {alertMessage}
        </Alert>
      )}
      <Form
        onSubmit={handleSubmit}
        className="p-4 border rounded shadow-sm bg-light"
      >
        <Row className="mb-3 justify-content-center">
          <Col xs="auto">
            <ToggleButtonGroup
              type="radio"
              name="entryType"
              defaultValue="manual"
              onChange={(value) => setImportMode(value === "import")}
            >
              <ToggleButton
                id="manual-entry"
                value="manual"
                variant={!importMode ? "primary" : "outline-primary"}
              >
                Manual Entry
              </ToggleButton>
              <ToggleButton
                id="import-file"
                value="import"
                variant={importMode ? "primary" : "outline-primary"}
              >
                Import from File
              </ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Row>

        {!importMode ? (
          <>
            <Form.Group controlId="formInjuryType" className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                value={injuryType}
                onChange={(e) => setInjuryType(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formStartDate" className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                max={getTodayDate()}
                value={injuryStartDate}
                onChange={(e) => setInjuryStartDate(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEndDate" className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                min={injuryStartDate}
                value={injuryEndDate}
                onChange={(e) => setInjuryEndDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPlayerSearch" className="mb-3">
              <Form.Label>Search Player</Form.Label>
              <Form.Control
                type="text"
                value={playerSearchQuery}
                onChange={(e) => setPlayerSearchQuery(e.target.value)}
                placeholder="Enter player's name"
              />
              {filteredPlayers.length > 0 && !selectedPlayer && (
                <ListGroup className="mt-2">
                  {filteredPlayers.map((player) => (
                    <ListGroup.Item
                      key={player.id}
                      action
                      onClick={() => handlePlayerSelect(player)}
                      style={{ cursor: "pointer" }}
                    >
                      {player.firstName} {player.lastName}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Form.Group>
          </>
        ) : (
          <>
            <Form.Group controlId="formFileType" className="mb-3">
              <Form.Label>File Type</Form.Label>
              <Form.Select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                required
              >
                <option value="">Select file type</option>
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Import Injuries (CSV or JSON)</Form.Label>
              <Form.Control
                type="file"
                accept=".csv,.json"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </Form.Group>
          </>
        )}

        <Button variant="primary" type="submit" className="w-100 mt-3">
          {importMode ? "Import Injuries" : "Add Injury"}
        </Button>
      </Form>

      {duplicateRecords.length > 0 && (
        <Alert variant="warning" className="mt-4">
          <strong>Duplicate Records Skipped:</strong>
          <ul>
            {duplicateRecords.map((record, index) => (
              <li key={index}>
                Record at row {record} was a duplicate and was skipped.
              </li>
            ))}
          </ul>
        </Alert>
      )}

      <Accordion className="mt-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>File Format Templates</Accordion.Header>
          <Accordion.Body className="text-start">
            <h5>JSON Template</h5>
            <pre>
              {`[
    {
        "type": "InjuryType",
        "start_date": "2024-10-15",
        "end_date": "2024-11-15",
        "player_id": "5"
    },
    {
        "type": "AnotherInjuryType",
        "start_date": "2023-05-13",
        "end_date": "2023-08-13",
        "player_id": "6"
    }
]`}
            </pre>
            <h5>CSV Template</h5>
            <pre>
              {`type,startDate,endDate,playerId
InjuryType1,2024-10-15,2024-11-15,5
InjuryType2,2023-05-13,2023-08-13,6`}
            </pre>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default AddInjuryForm;
