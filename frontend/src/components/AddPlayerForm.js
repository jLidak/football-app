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
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const AddPlayerForm = () => {
  const [manualEntry, setManualEntry] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [playerData, setPlayerData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nickname: "",
    picture: "", // Ścieżka obrazu będzie ustawiana przez backend
    positionId: "",
    countryId: "",
    value: "",
  });

  const [positions, setPositions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [file, setFile] = useState(null); // Obsługa plików obrazu
  const [fileType, setFileType] = useState("csv");

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear() - 15;
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    axios
      .get("http://localhost:8080/api/positions", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPositions(res.data))
      .catch((error) => console.error("Error fetching positions:", error));

    axios
      .get("http://localhost:8080/api/countries")
      .then((res) => setCountries(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    if (manualEntry) {
      const formData = new FormData();
      formData.append("firstName", playerData.firstName);
      formData.append("lastName", playerData.lastName);
      formData.append("dateOfBirth", playerData.dateOfBirth);
      formData.append("nickname", playerData.nickname);
      formData.append("positionId", playerData.positionId);
      formData.append("countryId", playerData.countryId);
      formData.append("value", playerData.value);
      if (file) {
        formData.append("picture", file);
      }

      axios
        .post("http://localhost:8080/api/players/add", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => alert("Player added successfully"))
        .catch((err) => alert("Failed to add player"));
    } else {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", fileType);

      axios
        .post("http://localhost:8080/api/players/import", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const { data } = response;
          if (
            data.includes(
              "The following records were not added due to duplicates:",
            )
          ) {
            alert(data);
          } else {
            alert("Players imported successfully");
          }
          setFile(null);
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            setAlertMessage(error.response.data);
          } else {
            setAlertMessage("An error occurred while adding bet");
          }
        });
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Add Player</h1>
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
            {/* Form fields for player information */}
            {/* Reszta kodu dla pól formularza */}

            {/* Form fields for player information */}
            <Form.Group controlId="formFirstName" className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={playerData.firstName}
                onChange={(e) =>
                  setPlayerData({ ...playerData, firstName: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="formLastName" className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={playerData.lastName}
                onChange={(e) =>
                  setPlayerData({ ...playerData, lastName: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group controlId="formDateOfBirth" className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                max={getTodayDate()}
                value={playerData.dateOfBirth}
                onChange={(e) =>
                  setPlayerData({ ...playerData, dateOfBirth: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formNickname" className="mb-3">
              <Form.Label>Nickname</Form.Label>
              <Form.Control
                type="text"
                value={playerData.nickname}
                onChange={(e) =>
                  setPlayerData({ ...playerData, nickname: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formPicture" className="mb-3">
              <Form.Label>Picture</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Form.Group>
            {/* Additional fields */}
            <Form.Group controlId="formPosition" className="mb-3">
              <Form.Label>Position</Form.Label>
              <Form.Select
                value={playerData.positionId}
                onChange={(e) =>
                  setPlayerData({ ...playerData, positionId: e.target.value })
                }
                required
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
                value={playerData.countryId}
                onChange={(e) =>
                  setPlayerData({ ...playerData, countryId: e.target.value })
                }
                required
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
                min="0"
                value={playerData.value}
                onChange={(e) =>
                  setPlayerData({ ...playerData, value: e.target.value })
                }
              />
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
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Import Players (CSV or JSON)</Form.Label>
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
          {manualEntry ? "Add Player" : "Import Players"}
        </Button>
      </Form>

      <Accordion className="mt-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>File Format Templates</Accordion.Header>
          <Accordion.Body className="text-start">
            <h5>JSON Template</h5>
            <pre>
              {`[
    {
        "firstName": "John",
        "lastName": "Doe",
        "dateOfBirth": "2000-01-01",
        "nickname": "JD",
        "positionId": 1,
        "countryId": 1,
        "value": 1000000.00
    },
    {
        "firstName": "Jane",
        "lastName": "Smith",
        "dateOfBirth": "1999-05-15",
        "nickname": "Smitty",
        "positionId": 2,
        "countryId": 2,
        "value": 850000.00
    }
]
`}
            </pre>
            <h5>CSV Template</h5>
            <pre>
              {`firstName,lastName,dateOfBirth,nickname,positionId,countryId,clubId,nationalTeamId,value
John,Doe,2000-01-01,JD,1,1,1,2,1000000.00
Jane,Smith,1999-05-15,Smitty,2,2,2,1,850000.00`}
            </pre>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default AddPlayerForm;
