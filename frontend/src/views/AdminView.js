import React, { useState } from "react";
import AddAdminOrModerator from "../components/AddAdminOrModerator";
import CreateNotificationForm from "../components/CreateNotificationForm";
import AdminPanel from "../components/AdminPanel";
import { Container, Row, Col, Accordion, ListGroup } from "react-bootstrap";

const AdminView = ({ setIsLoggedIn, handleLogout }) => {
  const [selectedComponent, setSelectedComponent] = useState(null);

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case "AddUserRole":
        return <AddAdminOrModerator />;
      case "AdminPanel":
        return (
          <AdminPanel
            setIsLoggedIn={setIsLoggedIn}
            handleLogout={handleLogout}
          />
        );
      case "CreateNotification":
        return <CreateNotificationForm />;
      default:
        return <p>Please select an option from the sidebar.</p>;
    }
  };

  return (
    <Container fluid className="my-5">
      <Row>
        <Col md={4} className="mb-4">
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Admin Functions</Accordion.Header>
              <Accordion.Body>
                <ListGroup>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("AddUserRole")}
                  >
                    Add Admin/Moderator
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("AdminPanel")}
                  >
                    Administration Panel
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("CreateNotification")}
                  >
                    Create Notification
                  </ListGroup.Item>
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
        <Col md={8}>
          <div className="p-4 border rounded shadow-sm bg-light">
            {renderSelectedComponent()}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminView;
