////DO WSZYSTKICH RÓL
//
//import React, { useState } from "react";
//import axios from "axios";
//import { Form, Button, Alert } from "react-bootstrap";
//
//const CreateNotificationForm = () => {
//    const [title, setTitle] = useState("");
//    const [message, setMessage] = useState("");
//    const [feedback, setFeedback] = useState("");
//
//    const handleSubmit = async (e) => {
//        e.preventDefault();
//
//        try {
//            const token = localStorage.getItem("jwtToken");
//            await axios.post(
//                "http://localhost:8080/api/notifications/create",
//                { title, message },
//                { headers: { Authorization: `Bearer ${token}` } }
//            );
//            setFeedback("Notification created successfully!");
//            setTitle("");
//            setMessage("");
//        } catch (error) {
//            console.error("Error creating notification:", error);
//            setFeedback("Failed to create notification.");
//        }
//    };
//
//    return (
//        <div>
//            <h3>Create Notification</h3>
//            {feedback && <Alert variant={feedback.includes("successfully") ? "success" : "danger"}>{feedback}</Alert>}
//            <Form onSubmit={handleSubmit}>
//                <Form.Group className="mb-3">
//                    <Form.Label>Title</Form.Label>
//                    <Form.Control
//                        type="text"
//                        value={title}
//                        onChange={(e) => setTitle(e.target.value)}
//                        required
//                        placeholder="Enter notification title"
//                    />
//                </Form.Group>
//                <Form.Group className="mb-3">
//                    <Form.Label>Message</Form.Label>
//                    <Form.Control
//                        as="textarea"
//                        rows={4}
//                        value={message}
//                        onChange={(e) => setMessage(e.target.value)}
//                        required
//                        placeholder="Enter notification message"
//                    />
//                </Form.Group>
//                <Button variant="primary" type="submit">
//                    Create Notification
//                </Button>
//            </Form>
//        </div>
//    );
//};
//
//export default CreateNotificationForm;

//DO WYBRANYCH RÓL

import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";

const CreateNotificationForm = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);

  const roles = ["ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"]; // Dostępne grupy użytkowników

  const handleRoleChange = (role) => {
    setSelectedRoles(
      (prevRoles) =>
        prevRoles.includes(role)
          ? prevRoles.filter((r) => r !== role) // Odznaczenie roli
          : [...prevRoles, role], // Zaznaczenie roli
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedRoles.length === 0) {
      setFeedback("Please select at least one group.");
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(
        "http://localhost:8080/api/notifications/create",
        { title, message, roles: selectedRoles }, // Przesyłanie zaznaczonych grup
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setFeedback("Notification created successfully!");
      setTitle("");
      setMessage("");
      setSelectedRoles([]);
    } catch (error) {
      console.error("Error creating notification:", error);
      setFeedback("Failed to create notification.");
    }
  };

  return (
    <div>
      <h3>Create Notification</h3>
      {feedback && (
        <Alert
          variant={feedback.includes("successfully") ? "success" : "danger"}
        >
          {feedback}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter notification title"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder="Enter notification message"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Target Groups</Form.Label>
          {roles.map((role) => (
            <Form.Check
              key={role}
              type="checkbox"
              label={role.replace("ROLE_", "")} // Usuwamy prefix "ROLE_"
              checked={selectedRoles.includes(role)}
              onChange={() => handleRoleChange(role)}
            />
          ))}
        </Form.Group>
        <Button variant="primary" type="submit">
          Create Notification
        </Button>
      </Form>
    </div>
  );
};

export default CreateNotificationForm;
