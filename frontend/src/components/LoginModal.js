import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

const LoginModal = ({
  isOpen,
  onClose,
  setIsLoggedIn,
  setLoginData,
  onOpenPasswordReset,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email,
          password,
        },
      );
      console.log(response.data);
      const { token, email: responseEmail, role = "USER" } = response.data;

      localStorage.setItem("jwtToken", token);
      localStorage.setItem("email", responseEmail);
      localStorage.setItem("role", role);

      setIsLoggedIn(true);
      setLoginData({ email: responseEmail, role });
      onClose();
    } catch (error) {
      setMessage(
        "Error while logging in. Check if the login details are correct.",
      );
      setMessageType("danger");
    }
  };

  useEffect(() => {
    setEmail("");
    setPassword("");
    setMessage("");
    setMessageType("");
  }, [isOpen]);

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleLogin}>
          <Form.Group controlId="formEmail">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your e-mail address"
              required
            />
          </Form.Group>
          <Form.Group controlId="formPassword" className="mt-3 mb-3">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </Form.Group>

          {message && (
            <p className={`text-${messageType} text-center`}>{message}</p>
          )}

          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>
        <div className="text-center mt-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onClose(); // Close login modal
              onOpenPasswordReset(); // Open password reset modal
            }}
            className="text-primary"
          >
            Forgot Password?
          </a>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
