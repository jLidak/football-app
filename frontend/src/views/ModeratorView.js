import React, { useState } from "react";
import AddLeagueForm from "../components/AddLeagueForm";
import LeagueSearchAndEditForm from "../components/LeagueSearchAndEditForm";
import AddCoachForm from "../components/AddCoachForm";
import CoachSearchAndEditForm from "../components/CoachSearchAndEditForm";
import AddTeamForm from "../components/AddTeamForm";
import TeamSearchAndEditForm from "../components/TeamSearchAndEditForm";
import AddStadiumForm from "../components/AddStadiumForm";
import StadiumSearchAndEditForm from "../components/StadiumSearchAndEditForm";
import AddCityForm from "../components/AddCityForm";
import AddPlayerForm from "../components/AddPlayerForm";
import PlayerSearchAndEditForm from "../components/PlayerSearchAndEditForm";
import PlayerImportForm from "../components/PlayerImportForm";
import AddRefereeForm from "../components/AddRefereeForm";
import RefereeSearchAndEditForm from "../components/RefereeSearchAndEditForm";
import AddCoachContractForm from "../components/AddCoachContractForm";
import EditCoachContractForm from "../components/EditCoachContractForm";
import AddPlayerContractForm from "../components/AddPlayerContractForm";
import EditPlayerContractForm from "../components/EditPlayerContractForm";
import AddInjuryForm from "../components/AddInjuryForm";
import EditInjuryForm from "../components/EditInjuryForm";
import AddMatchForm from "../components/AddMatchForm";
import EditMatchForm from "../components/EditMatchForm";
import AddRankingForm from "../components/AddRankingForm";
import RankingView from "../components/RankingView";
import EditRankingForm from "../components/EditRankingForm";

import { Container, Row, Col, Accordion, ListGroup } from "react-bootstrap";
import MatchSearchAndEditForm from "../components/MatchSearchAndEditForm";
import AddGroupForm from "../components/AddGroupForm";
import EditGroupForm from "../components/EditGroupForm";

const ModeratorView = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case "AddLeague":
        return <AddLeagueForm />;
      case "EditLeagues":
        return <LeagueSearchAndEditForm />;
      case "AddCoach":
        return <AddCoachForm />;
      case "EditCoaches":
        return <CoachSearchAndEditForm />;
      case "AddTeam":
        return <AddTeamForm />;
      case "EditTeams":
        return <TeamSearchAndEditForm />;
      case "AddStadium":
        return <AddStadiumForm />;
      case "EditStadiums":
        return <StadiumSearchAndEditForm />;
      case "AddCity":
        return <AddCityForm />;
      case "AddPlayer":
        return <AddPlayerForm />;
      case "EditPlayers":
        return <PlayerSearchAndEditForm />;
      case "ImportPlayers":
        return <PlayerImportForm />;
      case "AddReferee":
        return <AddRefereeForm />;
      case "EditReferees":
        return <RefereeSearchAndEditForm />;
      case "AddInjury":
        return <AddInjuryForm />;
      case "EditInjuries":
        return <EditInjuryForm />;
      case "AddCoachContract":
        return <AddCoachContractForm />;
      case "EditCoachContracts":
        return <EditCoachContractForm />;
      case "AddPlayerContract":
        return <AddPlayerContractForm />;
      case "EditPlayerContracts":
        return <EditPlayerContractForm />;
      case "AddMatch":
        return <AddMatchForm />;
      //case 'EditMatches': return <EditMatchForm />;
      case "EditMatches":
        return <MatchSearchAndEditForm />;
      case "AddRanking":
        return <AddRankingForm />;
      case "AddGroup":
        return <AddGroupForm />;
      case "EditGroup":
        return <EditGroupForm />;

      case "EditRankings":
        return <EditRankingForm />;

      default:
        return <p>Please select an option from the sidebar.</p>;
    }
  };

  return (
    <Container fluid className="my-5">
      <Row>
        {/* Sidebar */}
        <Col md={3} className="mb-4">
          <h4 className="mb-4">Moderator Functions</h4>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Add Data</Accordion.Header>
              <Accordion.Body>
                <ListGroup>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("AddCity")}
                  >
                    Add City
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("AddLeague")}
                  >
                    Add League
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("AddGroup")}
                  >
                    Add Group
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("AddTeam")}
                  >
                    Add Team
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("AddCoach")}
                  >
                    Add Coach
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("AddCoachContract")}
                  >
                    Add Coach Contract
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("AddPlayer")}
                  >
                    Add Player
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("AddInjury")}
                  >
                    Add Injury
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("AddPlayerContract")}
                  >
                    Add Player Contract
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("AddStadium")}
                  >
                    Add Stadium
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("AddReferee")}
                  >
                    Add Referee
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("AddMatch")}
                  >
                    Add Match
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("AddRanking")}
                  >
                    Add Ranking
                  </ListGroup.Item>
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Edit Data</Accordion.Header>
              <Accordion.Body>
                <ListGroup>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("EditLeagues")}
                  >
                    Edit Leagues
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("EditGroup")}
                  >
                    Edit Groups
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("EditTeams")}
                  >
                    Edit Teams
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("EditCoaches")}
                  >
                    Edit Coaches
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("EditCoachContracts")}
                  >
                    Edit Coach Contracts
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("EditPlayers")}
                  >
                    Edit Players
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("EditInjuries")}
                  >
                    Edit Injuries
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("EditPlayerContracts")}
                  >
                    Edit Player Contracts
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("EditStadiums")}
                  >
                    Edit Stadiums
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("EditReferees")}
                  >
                    Edit Referees
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("EditMatches")}
                  >
                    Edit Matches
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    onClick={() => setSelectedComponent("EditRankings")}
                  >
                    Edit Rankings
                  </ListGroup.Item>
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>

        {/* Main Content Area */}
        <Col md={9}>
          <h4 className="mb-4 text-center">Football Data Management</h4>
          <div className="p-4 border rounded shadow-sm bg-light">
            {renderSelectedComponent()}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ModeratorView;
