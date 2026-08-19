import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Importuj useNavigate
import "bootstrap/dist/css/bootstrap.min.css";

const RegisterAdminForm = () => {
  const [adminData, setAdminData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const navigate = useNavigate(); // Zdefiniuj hook do nawigacji

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/api/auth/register-admin", adminData)
      .then(() => {
        alert("Admin account created successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        alert(error.response?.data || "An error occurred");
      });
  };

  return (
    <Container className="mt-5">
      <div className="text-center mb-4">
        <h4>
          There is no admin account registered. You have to register one below
          to continue.
        </h4>
      </div>
      <Form
        onSubmit={handleSubmit}
        className="p-4 border rounded shadow-sm bg-light"
      >
        <h1 className="text-center mb-4">Register Admin</h1>
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={adminData.email}
            onChange={(e) =>
              setAdminData({ ...adminData, email: e.target.value })
            }
            required
          />
        </Form.Group>

        <Form.Group controlId="formUsername" className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={adminData.username}
            onChange={(e) =>
              setAdminData({ ...adminData, username: e.target.value })
            }
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={adminData.password}
            onChange={(e) =>
              setAdminData({ ...adminData, password: e.target.value })
            }
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Create Admin
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterAdminForm;
