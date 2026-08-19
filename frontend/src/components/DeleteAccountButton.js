import React from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { DropdownItem } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

const DeleteAccountButton = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (window.confirm("Do you really want to delete your account?")) {
      try {
        const token = localStorage.getItem("jwtToken");
        await axios.delete("http://localhost:8080/api/auth/delete-account", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        localStorage.removeItem("jwtToken");
        setIsLoggedIn(false);
        localStorage.setItem(
          "logoutOrDeleteAccMessage",
          "Your account has been deleted.",
        );
        navigate("/");
        window.scrollTo(0, 0);
        window.location.reload();
      } catch (error) {
        alert("There was a problem deleting the account.");
      }
    }
  };

  return (
    <DropdownItem onClick={handleDeleteAccount} className="deleteButton">
      Delete account
    </DropdownItem>
  );
};

export default DeleteAccountButton;
