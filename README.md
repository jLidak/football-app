# ⚽ Football App

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat&logo=spring-boot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=JSON%20web%20tokens)

**Football App** is a comprehensive, full-stack web application designed for managing and analyzing football data, including matches, teams, players, and statistics.

The platform allows football enthusiasts to explore match details, track player performances, view league standings, and predict match results. It features an interactive ranking system based on user predictions, while providing administrators and moderators with a robust back-office to seamlessly manage data and control system content.

## ✨ Key Features

### 👤 User

- **Match Predictions & Ranking:** Predict match scores and climb the global ranking system.
- **Deep Match Insights:** Browse match history including events (goals, cards, substitutions), statistics, and lineups.
- **Live Tracking:** View a real-time match minute counter.
- **Comprehensive Database:** Explore detailed pages for teams, players, coaches, and league standings.
- **Personalization:** Manage favorite teams, matches, and leagues, and receive targeted notifications.
- **Account Management:** Secure password recovery and changes via email.

### 🛡️ Moderator

- **Data Management:** Full CRUD operations for Teams, Leagues, Matches, Players, and Contracts.
- **Data Portability:** Seamlessly import massive datasets using JSON/CSV files.
- **Match Administration:** Update match statistics, set lineups, and log real-time events.

### ⚙️ Admin

- **Access Control:** Create and manage Moderator and Admin accounts.
- **User Management:** Delete accounts and forcefully reset user passwords.
- **Global Communication:** Send targeted system notifications to specific users or groups.

## 🏗️ Architecture & Security

- **Client-Server Model:** The frontend (React) handles dynamic UI/UX, while the backend (Spring Boot) processes business logic and data persistence.
- **RESTful API:** Seamless communication between layers using JSON.
- **Authentication:** Stateless authentication flow using **JWT (JSON Web Tokens)**.
- **Data Protection:** Passwords are securely hashed using **BCrypt**.
- **Authorization:** Strict Role-Based Access Control (RBAC) ensures endpoints are protected based on user privileges.

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose (Recommended)
- Node.js (for manual frontend setup)
- Java 17+
- PostgreSQL (for manual backend setup)

### Clone the Repository

```bash
git clone https://github.com/SzymonKozyra/football-app.git
cd football-app
```

### Option 1: Run with Docker (Recommended)

This is the fastest way to get the application up and running.

1. Ensure Docker Desktop is running.
2. Build and start the containers:

```bash
docker-compose up --build
```

3. Access the application at: http://localhost:3000

### Option 2: Run Manually

#### 1. Database Setup

- Install and run PostgreSQL.
- Create a new database.
- Update your database credentials in the backend configuration:

```text
src/main/resources/application.properties
```

#### 2. Backend Setup

- Open the backend directory in your preferred IDE, such as IntelliJ IDEA or Eclipse.
- Run the main application class:

```text
FootballappApplication.java
```

#### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

#### 4. Access the application at: http://localhost:3000

> **💡 Note:** The very first account registered in the system automatically receives **ADMIN** privileges. Only an Admin can elevate other users to Moderator or Admin roles.

## 📸 Screenshots

*A visual overview of the application's interface and capabilities.*

### User main page:
![User main page](screenshots/user-homepage.png)
### View responsiveness:
![View responsiveness](screenshots/view-responsiveness.png)
### Match Events:
![Match Events](screenshots/match-events.png)
### Match Statistics:
![Match Statistics](screenshots/match-statistics.png)
### Match Lineups:
![Match Lineups](screenshots/match-lineups.png)
### Score bet page:
![Score bet page](screenshots/score-bet.png)
### Notifications:
![Notifications](screenshots/notifications.png)
### Ranking:
![Ranking](screenshots/ranking.png)
### Transfers page:
![Transfers page](screenshots/transfers-page.png)
### Player page:
![Player page](screenshots/player-page.png)
### Team page:
![Team page](screenshots/team-page.png)
### League standings page1:
![League standings page1](screenshots/league-standings.png)
### League standings page2:
![League standings page2](screenshots/league-standings2.png)
### Search team page:
![Search team page](screenshots/search-team.png)
### Add team page:
![Add team page](screenshots/add-team.png)
### Admin panel:
![Admin panel](screenshots/admin-panel.png)

## 🔮 Future Improvements

- UI/UX refinements for mobile devices.
- Implementation of caching mechanisms for heavy database queries, such as Redis.
- CI/CD pipeline integration using GitHub Actions.