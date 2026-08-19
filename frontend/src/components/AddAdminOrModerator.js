import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
} from "react-bootstrap";

const AddAdminOrModerator = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("MODERATOR"); // Default to MODERATOR
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleAddUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      console.error("Authorization token is missing");
      return;
    }

    const endpoint =
      role === "ADMIN"
        ? "http://localhost:8080/api/admin/add-admin"
        : "http://localhost:8080/api/admin/add-moderator";

    try {
      await axios.post(
        endpoint,
        { email, password, username },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessage(`${role} added successfully`);
      setMessageType("success");
      setTimeout(() => {
        setMessage("");
        setEmail("");
        setPassword("");
        setUsername("");
      }, 2000);
    } catch (error) {
      console.error(
        `Error adding ${role.toLowerCase()}:`,
        error.response?.data || error.message,
      );
      setMessage(
        `Failed to add ${role.toLowerCase()}: ${error.response?.data || "Unknown error"}`,
      );
      setMessageType("danger");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  return (
    <Container className="mt-2">
      <h2 className="text-center mb-4">Add Admin or Moderator</h2>
      <Form
        onSubmit={handleAddUser}
        className="p-4 border rounded shadow-sm bg-light"
      >
        {message && <Alert variant={messageType}>{message}</Alert>}

        {/* Role Selection Toggle */}
        <Row className="mb-3 justify-content-center">
          <Col xs="auto">
            <ToggleButtonGroup
              type="radio"
              name="role"
              value={role}
              onChange={(value) => setRole(value)}
            >
              <ToggleButton
                id="role-moderator"
                value="MODERATOR"
                variant={role === "MODERATOR" ? "primary" : "outline-primary"}
              >
                Moderator
              </ToggleButton>
              <ToggleButton
                id="role-admin"
                value="ADMIN"
                variant={role === "ADMIN" ? "primary" : "outline-primary"}
              >
                Admin
              </ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Row>

        {/* Form Fields */}
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />
            </Form.Group>

            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-60 mt-3">
              Add {role === "ADMIN" ? "Admin" : "Moderator"}
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default AddAdminOrModerator;
