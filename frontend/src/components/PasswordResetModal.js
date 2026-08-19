import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

const PasswordResetModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/auth/reset-password", {
        email,
      });
      setMessage("The password reset link has been sent.");
      setMessageType("success");
      setIsEmailSent(true);
    } catch (error) {
      setMessage("The link could not be sent. Check if the email is correct.");
      setMessageType("danger");
      setIsEmailSent(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setMessage("");
      setMessageType("");
      setIsEmailSent(false);
    }
  }, [isOpen]);

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Password Reset</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handlePasswordReset}>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your e-mail address"
              required
            />
          </Form.Group>

          {message && (
            <p className={`text-${messageType} text-center`}>{message}</p>
          )}

          {/*{isEmailSent && (*/}
          {/*    <p className="text-success mt-3">*/}
          {/*        An email with the password reset link has been sent to your address.*/}
          {/*    </p>*/}
          {/*)}*/}
          <Button variant="primary" type="submit" className="w-100">
            Send reset link
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PasswordResetModal;
