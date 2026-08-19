import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Container, ListGroup, Modal, Button } from "react-bootstrap";

const NotificationsView = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log("Decoded username:", decodedToken.sub);
      setUsername(decodedToken.sub); // Zakładam, że `sub` to nazwa użytkownika
    }
  }, []);

  useEffect(() => {
    if (username) {
      const token = localStorage.getItem("jwtToken");
      axios
        .get(`http://localhost:8080/api/notifications/unread/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setNotifications(response.data))
        .catch((error) =>
          console.error("Error fetching notifications:", error),
        );
    }
  }, [username]);

  //    useEffect(() => {
  //        const token = localStorage.getItem('jwtToken');
  //        axios.get('http://localhost:8080/api/notifications/unread/${userId}', {
  //                headers: { Authorization: `Bearer ${token}` },
  //            })
  //            .then((response) => setNotifications(response.data))
  //            .catch((error) => console.error('Error fetching notifications:', error));
  //    }, []);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);

    // Oznacz powiadomienie jako przeczytane
    const token = localStorage.getItem("jwtToken");
    axios
      .post(
        `http://localhost:8080/api/notifications/markAsRead/${notification.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then(() => {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, read: true } : n,
          ),
        );
      })
      .catch((error) =>
        console.error("Error marking notification as read:", error),
      );
  };

  const handleCloseModal = () => setSelectedNotification(null);

  return (
    <Container className="mt-4">
      <h2>Notifications</h2>
      <ListGroup>
        {notifications.map((notification) => (
          <ListGroup.Item
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            style={{
              fontWeight: notification.read ? "normal" : "bold",
              cursor: "pointer",
            }}
          >
            <div style={{ flex: 1, textAlign: "center" }}>
              {notification.title}
            </div>
            <span style={{ flexShrink: 0 }}>
              {new Date(notification.timestamp).toLocaleString("pl-PL", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Modal z treścią powiadomienia */}
      {selectedNotification && (
        <Modal show onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedNotification.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{selectedNotification.message}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default NotificationsView;
