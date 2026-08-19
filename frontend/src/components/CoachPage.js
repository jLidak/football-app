import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Nav } from "react-bootstrap";
import Sidebar from "./Sidebar";
import UsePagination from "./UsePagination";
import PaginationComponent from "./PaginationComponent";

const BASE_URL = "http://localhost:8080";

const CoachPage = () => {
  const { id } = useParams();
  const [coach, setCoach] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [activeTab, setActiveTab] = useState("information");

  const token = localStorage.getItem("jwtToken");

  const contractsPagination = UsePagination(contracts, 5);

  useEffect(() => {
    // Fetch coach information
    axios
      .get(`${BASE_URL}/api/coaches/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setCoach(response.data))
      .catch((error) => console.error("Error fetching coach:", error));

    // Fetch coach contracts
    axios
      .get(`${BASE_URL}/api/coach-contracts/coach/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setContracts(response.data))
      .catch((error) => console.error("Error fetching contracts:", error));
  }, [id, token]);

  const renderCoachInformation = () => {
    if (!coach) return <p>Loading coach information...</p>;

    const calculateAge = (birthDate) => {
      if (birthDate === "null") {
        return "Unknown";
      }

      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }

      return `${birthDate} (${age})`;
    };

    const dateOfBirth = coach.dateOfBirth;
    const age = calculateAge(dateOfBirth);

    return (
      <Card className="mb-4">
        <Card.Body>
          <h5>General Information</h5>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td className="bg-light">
                  <strong>Country:</strong>
                </td>
                <td className="text-center">
                  {coach.country ? (
                    <div className="d-flex justify-content-center align-items-center">
                      <img
                        src={`/assets/flags/${coach.country.code}.svg`}
                        alt={coach.country.name}
                        style={{
                          width: "20px",
                          height: "15px",
                          marginRight: "10px",
                          borderRadius: "2px",
                          boxShadow: "0 0 2px rgba(0, 0, 0, 0.2)",
                        }}
                      />
                      <span>{coach.country.name}</span>
                    </div>
                  ) : (
                    "Unknown country"
                  )}
                </td>
              </tr>
              <tr>
                <td className="bg-light">
                  <strong>Nickname:</strong>
                </td>
                <td className="text-center">
                  {coach.nickname || "No nickname"}
                </td>
              </tr>
              <tr>
                <td className="bg-light">
                  <strong>Date of Birth (Age):</strong>
                </td>
                <td className="text-center">
                  {calculateAge(coach.dateOfBirth)}
                </td>
              </tr>
            </tbody>
          </table>
        </Card.Body>
      </Card>
    );
  };

  const renderContracts = () => {
    const { currentResults, totalPages, currentPage, handlePageChange } =
      contractsPagination;

    return (
      <Card className="mb-4">
        <Card.Body>
          <h5>Contract History</h5>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Team</th>
                <th>Salary</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentResults.map((contract) => (
                <tr key={contract.id}>
                  <td>{contract.startDate}</td>
                  <td>{contract.endDate || "Current"}</td>
                  <td>{contract.team?.name || "N/A"}</td>
                  <td>${contract.salary?.toLocaleString() || "N/A"}</td>
                  <td>{contract.isActive ? "Active" : "Inactive"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </Card.Body>
      </Card>
    );
  };

  if (!coach) return <p>Sorry, we can't find that coach :(</p>;

  return (
    <Container fluid>
      <Row>
        <Col md={3} className="bg-light border-right">
          <Sidebar />
        </Col>
        <Col md={9} style={{ marginTop: "20px" }}>
          <div className="text-center mb-4">
            <h3>{`${coach.firstName} ${coach.lastName}`}</h3>
          </div>
          <Nav
            variant="tabs"
            activeKey={activeTab}
            onSelect={(selectedKey) => setActiveTab(selectedKey)}
            className="justify-content-center"
          >
            <Nav.Item>
              <Nav.Link eventKey="information">Coach Information</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="contracts">Contracts</Nav.Link>
            </Nav.Item>
          </Nav>
          {activeTab === "information" && renderCoachInformation()}
          {activeTab === "contracts" && renderContracts()}
        </Col>
      </Row>
    </Container>
  );
};

export default CoachPage;
