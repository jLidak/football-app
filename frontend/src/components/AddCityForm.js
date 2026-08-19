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

const AddCityForm = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [cityName, setCityName] = useState("");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [manualEntry, setManualEntry] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/countries")
      .then((response) => setCountries(response.data))
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      console.error("Authorization token is missing");
      return;
    }

    if (manualEntry) {
      const cityData = {
        name: cityName,
        country: { name: selectedCountry },
      };

      axios
        .post("http://localhost:8080/api/cities/add", cityData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          alert("City added successfully");
          setCityName("");
          setSelectedCountry("");
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            setAlertMessage(error.response.data);
          } else {
            setAlertMessage("An error occurred while adding coach");
          }
        });
    } else {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", fileType);

      axios
        .post("http://localhost:8080/api/cities/import", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const { message, duplicates } = response.data;
          alert(message);
          if (duplicates && duplicates.length > 0) {
            console.log("Skipped duplicate records at positions:", duplicates);
          }
          setFile(null);
          setFileType("");
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            setAlertMessage(error.response.data);
          } else {
            setAlertMessage("An error occurred while adding city");
          }
        });
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Add City</h1>
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
            <Form.Group controlId="formCountry" className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                required
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formCityName" className="mb-3">
              <Form.Label>City Name</Form.Label>
              <Form.Control
                type="text"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                placeholder="Enter city name"
                required
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
                <option value="">Select file type</option>
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Import Cities (CSV or JSON)</Form.Label>
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
          {manualEntry ? "Add City" : "Import Cities"}
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
        "name": "Manchester",
        "countryName": "England"
    },
    {
        "name": "New York",
        "countryName": "United States"
    }
]`}
            </pre>
            <h5>CSV Template</h5>
            <pre>
              {`name,countryName
Manchester,England
New York,United States`}
            </pre>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default AddCityForm;
