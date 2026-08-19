import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert } from "react-bootstrap";
import Navbar from "./components/Navbar";
import RegistrationModal from "./components/RegistrationModal";
import LoginModal from "./components/LoginModal";
import PasswordResetModal from "./components/PasswordResetModal";
import NewPasswordModal from "./components/NewPasswordModal";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import AddLeagueForm from "./components/AddLeagueForm";
import AddCoachForm from "./components/AddCoachForm";
import RegisterAdminForm from "./components/RegisterAdminForm";
import "./App.css";
import MainView from "./components/MainView";
import LeaguePage from "./components/LeaguePage";
import AdminView from "./views/AdminView";
import ModeratorView from "./views/ModeratorView";
import MainViewGuest from "./components/MainViewGuest";
import AddMatchForm from "./components/AddMatchForm";
import AddPlayersMatchSquadForm from "./components/AddPlayersMatchSquadForm";
import EventManagement from "./components/EventManagement";
import AddMatchSquadForm from "./components/AddMatchSquadForm";
import AddBetForm from "./components/AddBetForm";
import PlayerPage from "./components/PlayerPage";
import CoachPage from "./components/CoachPage";
import TeamPage from "./components/TeamPage";
import TransfersPage from "./components/TransfersPage";
import CreateNotificationForm from "./components/CreateNotificationForm";
import NotificationsView from "./components/NotificationsView";
import RankingView from "./components/RankingView";

function App() {
  const [modals, setModals] = useState({
    isRegistrationOpen: false,
    isLoginOpen: false,
    isPasswordResetOpen: false,
    isNewPasswordOpen: false,
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", role: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [adminExists, setAdminExists] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [currentMode, setCurrentMode] = useState("user"); // Track user mode

  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const location = useLocation();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/auth/check-admin")
      .then((response) => setAdminExists(response.data))
      .catch((error) => console.error("Error checking if admin exists:", error))
      .finally(() => setIsCheckingAdmin(false));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setIsLoggedIn(true);
      const email = localStorage.getItem("email");
      const role = localStorage.getItem("role");
      setLoginData({ email, role });
    } else {
      setIsLoggedIn(false);
      setLoginData({ email: "", role: "" });
    }
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const resetToken = searchParams.get("token");
    if (resetToken) {
      setToken(resetToken);
      setModals((prevModals) => ({ ...prevModals, isNewPasswordOpen: true }));
    }
  }, [location.search]);

  useEffect(() => {
    // Initialize mode based on role
    if (loginData.role === "ROLE_ADMIN") {
      setCurrentMode("admin");
    } else if (loginData.role === "ROLE_MODERATOR") {
      setCurrentMode("moderator");
    }
  }, [loginData]);

  useEffect(() => {
    const logoutOrDeleteAccMessage = localStorage.getItem(
      "logoutOrDeleteAccMessage",
    );
    if (logoutOrDeleteAccMessage) {
      setMessage(logoutOrDeleteAccMessage);
      setMessageType("success");
      localStorage.removeItem("logoutOrDeleteAccMessage");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  }, []);

  const toggleModal = (modalName) => {
    setModals((prevModals) => ({
      ...prevModals,
      [modalName]: !prevModals[modalName],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setIsLoggedIn(false);
    setLoginData({ email: "", role: "" });
    localStorage.setItem(
      "logoutOrDeleteAccMessage",
      "You have been logged out.",
    );
    setCurrentMode("user");
    navigate("/");
    window.scrollTo(0, 0);
    window.location.reload();
  };

  const handleModeSwitch = () => {
    let newMode = currentMode;

    if (loginData.role === "ROLE_ADMIN") {
      newMode = currentMode === "admin" ? "user" : "admin";
    } else if (loginData.role === "ROLE_MODERATOR") {
      newMode = currentMode === "moderator" ? "user" : "moderator";
    }

    setCurrentMode(newMode); // Ustawienie nowego widoku
    navigate("/"); // Przejście na stronę główną
  };

  const handleNewPasswordSubmit = async (newPassword) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/reset-password-confirm",
        {
          token,
          password: newPassword,
        },
      );
      if (response.status === 200) {
        console.log("Password reset successfully!");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  const handleOpenRegistrationModal = () => {
    setModals((prevModals) => ({
      ...prevModals,
      isRegistrationOpen: true, // Otwiera modal rejestracji
    }));
  };

  const toggleRegistrationModal = () => {
    setModals((prevModals) => ({
      ...prevModals,
      isRegistrationOpen: true, // Otwiera modal rejestracji
    }));
  };

  if (isCheckingAdmin) {
    return null;
  }

  if (!adminExists) {
    return (
      <div className="App">
        <RegisterAdminForm />
      </div>
    );
  }

  return (
    <div className="App">
      <div className="navbar">
        <Navbar
          isLoggedIn={isLoggedIn}
          loginData={loginData}
          onLogout={handleLogout}
          setIsLoggedIn={setIsLoggedIn}
          onOpenLogin={() => toggleModal("isLoginOpen")}
          onOpenRegistration={() => toggleModal("isRegistrationOpen")}
          onOpenPasswordReset={() => toggleModal("isPasswordResetOpen")}
          onModeSwitch={handleModeSwitch}
          currentMode={currentMode}
        />
      </div>

      {message && (
        <Alert variant={messageType} className="logoutOrDeleteAccMessage mb-3">
          {message}
        </Alert>
      )}

      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              currentMode === "admin" ? (
                <AdminView />
              ) : currentMode === "moderator" ? (
                <ModeratorView />
              ) : (
                <MainView />
              )
            ) : (
              <MainViewGuest onOpenRegistration={toggleRegistrationModal} />
            )
          }
        />
        <Route path="/league/:id" element={<LeaguePage />} />
        <Route path="/add-league" element={<AddLeagueForm />} />
      </Routes>

      {/* Modale */}
      <RegistrationModal
        isOpen={modals.isRegistrationOpen}
        onClose={() => toggleModal("isRegistrationOpen")}
        onOpenLogin={() => toggleModal("isLoginOpen")}
      />
      <LoginModal
        isOpen={modals.isLoginOpen}
        onClose={() => toggleModal("isLoginOpen")}
        setIsLoggedIn={setIsLoggedIn}
        setLoginData={setLoginData}
        onOpenPasswordReset={() => toggleModal("isPasswordResetOpen")}
      />
      <PasswordResetModal
        isOpen={modals.isPasswordResetOpen}
        onClose={() => toggleModal("isPasswordResetOpen")}
      />

      <NewPasswordModal
        isOpen={modals.isNewPasswordOpen}
        onClose={() => toggleModal("isNewPasswordOpen")}
        onSubmit={handleNewPasswordSubmit}
        token={token}
      />

      <Routes>
        <Route path="/add-match" element={<AddMatchForm />} />
        <Route
          path="/add-match-squad/:matchId"
          element={<AddMatchSquadForm />}
        />
        <Route
          path="/add-players-match-squad/:matchSquadId"
          element={<AddPlayersMatchSquadForm />}
        />
        <Route
          path="/admin-panel"
          element={
            isLoggedIn && loginData.role === "ROLE_ADMIN" ? (
              <AdminPanel />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/manage-events/:matchId" element={<EventManagement />} />
        <Route path="/add-bet" element={<AddBetForm />} />
        {/*<Route path="/" element={<MainView />} />*/}
        <Route path="/player/:id" element={<PlayerPage />} />
        <Route path="/coach/:id" element={<CoachPage />} />
        <Route path="/team/:id" element={<TeamPage />} />
        <Route path="/transfers" element={<TransfersPage />} />
        <Route path="/notifications" element={<NotificationsView />} />
        <Route path="/ranking" element={<RankingView />} />
      </Routes>
    </div>
  );
}

export default App;
