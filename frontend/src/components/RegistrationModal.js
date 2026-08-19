import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

const RegistrationModal = ({ isOpen, onClose, onOpenLogin }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password.length < 1) {
      setMessage("The password must contain at least 8 characters.");
      setMessageType("danger");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords must be identical.");
      setMessageType("danger");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          username,
          email,
          password,
        },
      );
      setMessage(response.data);
      setMessageType("success");
      setTimeout(() => {
        setMessage("");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }, 2000);
    } catch (error) {
      setMessage("Registration error. User already exists or other errors.");
      setMessageType("danger");
    }
  };

  useEffect(() => {
    if (isOpen) {
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setMessage("");
      setMessageType("");
    }
  }, [isOpen]);

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Registration</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleRegister}>
          <Form.Group controlId="formUsername">
            <Form.Label>Username:</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmail" className="mt-3">
            <Form.Label>E-mail:</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your e-mail address"
              required
            />
          </Form.Group>
          <Form.Group controlId="formPassword" className="mt-3">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </Form.Group>
          <Form.Group controlId="formConfirmPassword" className="mt-3 mb-3">
            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </Form.Group>

          {message && (
            <p className={`text-${messageType} text-center`}>{message}</p>
          )}

          <Button variant="primary" type="submit" className="w-100">
            Register
          </Button>
        </Form>
        <p className="text-center mt-3" style={{ color: "black" }}>
          Already have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onClose();
              onOpenLogin();
            }}
          >
            Login
          </a>
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default RegistrationModal;
