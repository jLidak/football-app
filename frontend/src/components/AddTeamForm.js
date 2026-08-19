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
  ListGroup,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const AddTeamForm = () => {
  const [teamName, setTeamName] = useState("");
  const [isClub, setIsClub] = useState(true);
  const [leagueSearchQuery, setLeagueSearchQuery] = useState("");
  const [filteredLeagues, setFilteredLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [manualEntry, setManualEntry] = useState(true);
  const [file, setFile] = useState(null); // For importing teams
  const [pictureFile, setPictureFile] = useState(null); // For uploading picture in manual entry
  const [fileType, setFileType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (leagueSearchQuery) {
      if (selectedLeague && leagueSearchQuery !== selectedLeague.name) {
        setSelectedLeague(null);
      }

      const token = localStorage.getItem("jwtToken");
      axios
        .get(
          `http://localhost:8080/api/leagues/search?query=${leagueSearchQuery}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then((response) => setFilteredLeagues(response.data))
        .catch((error) => console.error("Error fetching leagues:", error));
    } else {
      setFilteredLeagues([]);
      setSelectedLeague(null);
    }
  }, [leagueSearchQuery, selectedLeague]);

  const handleLeagueSelect = (league) => {
    setSelectedLeague(league);
    setLeagueSearchQuery(league.name);
    setFilteredLeagues([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    if (manualEntry) {
      const formData = new FormData();
      formData.append("name", teamName);
      formData.append("isClub", isClub);
      formData.append("leagueId", selectedLeague ? selectedLeague.id : null);
      if (pictureFile) {
        formData.append("picture", pictureFile);
      }

      axios
        .post("http://localhost:8080/api/teams/add", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          alert(response.data); // Shows success message
          // Reset state here...
          setTeamName("");
          setIsClub(true);
          setLeagueSearchQuery("");
          setSelectedLeague(null);
          setPictureFile(null);
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            setAlertMessage(error.response.data);
          } else {
            setAlertMessage("An error occurred while adding bet");
          }
        });
    } else {
      const importFormData = new FormData();
      importFormData.append("file", file);
      importFormData.append("type", fileType);

      axios
        .post("http://localhost:8080/api/teams/import", importFormData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          alert(response.data);
          setFile(null);
          setFileType("");
        })
        .catch((error) => {
          console.error("Error importing teams:", error);
          alert(error.response?.data || "Failed to import teams");
        });
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Add Team</h1>
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
              onChange={(value) => setManualEntry(value === "manual")}
            >
              <ToggleButton
                id="manual-entry"
                value="manual"
                variant={manualEntry ? "primary" : "outline-primary"}
              >
                Manual Entry
              </ToggleButton>
              <ToggleButton
                id="import-file"
                value="import"
                variant={!manualEntry ? "primary" : "outline-primary"}
              >
                Import from File
              </ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Row>

        {manualEntry ? (
          <>
            <Form.Group controlId="formTeamName" className="mb-3">
              <Form.Label>Team Name</Form.Label>
              <Form.Control
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name"
                required
              />
            </Form.Group>

            <Form.Group controlId="formPictureFile" className="mb-3">
              <Form.Label>Upload Team Picture</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setPictureFile(e.target.files[0])}
              />
            </Form.Group>

            <Form.Group controlId="formIsClub" className="mb-3">
              <Form.Label>Is Club?</Form.Label>
              <Form.Select
                value={isClub}
                onChange={(e) => setIsClub(e.target.value === "true")}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formLeagueSearch" className="mb-3">
              <Form.Label>Search League</Form.Label>
              <Form.Control
                type="text"
                value={leagueSearchQuery}
                onChange={(e) => setLeagueSearchQuery(e.target.value)}
                placeholder="Search for a league"
              />
              {filteredLeagues.length > 0 && !selectedLeague && (
                <ListGroup className="mt-2">
                  {filteredLeagues.map((league) => (
                    <ListGroup.Item
                      key={league.id}
                      action
                      onClick={() => handleLeagueSelect(league)}
                      style={{ cursor: "pointer" }}
                    >
                      {league.name}
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
              <Form.Label>Import Teams (CSV or JSON)</Form.Label>
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
          {manualEntry ? "Add Team" : "Import Teams"}
        </Button>
      </Form>

      {/* Template Section */}
      <Accordion className="mt-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>File Format Templates</Accordion.Header>
          <Accordion.Body className="text-start">
            <h5>JSON Template</h5>
            <pre>
              {`[
    {
        "name": "TeamName",
        "isClub": true,
        "picture": "pictureFileName",
        "leagueId": 1
    },
    {
        "name": "AnotherTeam",
        "isClub": false,
        "picture": "anotherPictureFileName",
        "leagueId": 2
    }
]`}
            </pre>
            <h5>CSV Template</h5>
            <pre>
              {`name,isClub,picture,leagueId
TeamName1,true,pictureFileName,1
AnotherTeam,false,anotherPictureFileName,2`}
            </pre>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default AddTeamForm;
