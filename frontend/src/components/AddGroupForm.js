import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, ListGroup, Modal } from "react-bootstrap";

const AddGroupForm = () => {
  const [groupName, setGroupName] = useState("");
  const [selectedLeague, setSelectedLeague] = useState(null);

  const [showLeagueModal, setShowLeagueModal] = useState(false);
  const [countries, setCountries] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [editions, setEditions] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedLeagueName, setSelectedLeagueName] = useState(null);
  const [selectedEdition, setSelectedEdition] = useState(null);

  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);

  // Pobranie krajów i inicjalizacja modal
  const handleOpenLeagueModal = () => {
    setSelectedCountry(null);
    setSelectedLeagueName(null);
    setSelectedEdition(null);
    setCountries([]);
    setLeagues([]);
    setEditions([]);

    const token = localStorage.getItem("jwtToken");
    axios
      .get("http://localhost:8080/api/leagues/countries", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setCountries(response.data))
      .catch((error) => console.error("Error fetching countries:", error));

    setShowLeagueModal(true);
  };

  // Pobierz ligi dla wybranego kraju
  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setSelectedLeagueName(null);
    setSelectedEdition(null);

    const token = localStorage.getItem("jwtToken");
    axios
      .get(`http://localhost:8080/api/leagues/byCountry?country=${country}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const uniqueLeagues = response.data.filter(
          (league, index, self) =>
            index === self.findIndex((l) => l.name === league.name),
        );
        setLeagues(uniqueLeagues);
      })
      .catch((error) => console.error("Error fetching leagues:", error));
  };

  // Pobierz edycje ligi
  const handleSelectLeagueName = (leagueName) => {
    setSelectedLeagueName(leagueName);
    setSelectedEdition(null);

    const token = localStorage.getItem("jwtToken");
    axios
      .get(
        `http://localhost:8080/api/leagues/editions?leagueName=${leagueName}&country=${selectedCountry}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((response) => setEditions(response.data))
      .catch((error) => console.error("Error fetching editions:", error));
  };

  // Wybierz edycję i ustaw pełny obiekt ligi
  const handleSelectEdition = (edition) => {
    setSelectedEdition(edition);

    const token = localStorage.getItem("jwtToken");
    axios
      .get(
        `http://localhost:8080/api/leagues/getByDetails?country=${selectedCountry}&name=${selectedLeagueName}&edition=${edition}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((response) => {
        setSelectedLeague(response.data);
        setShowLeagueModal(false);
      })
      .catch((error) => {
        console.error("Error fetching league by details:", error);
        alert("Failed to fetch league details");
      });
  };

  // Wyszukiwanie drużyn
  useEffect(() => {
    if (teamSearchQuery) {
      const token = localStorage.getItem("jwtToken");
      axios
        .get(
          `http://localhost:8080/api/teams/search?query=${teamSearchQuery}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then((response) => {
          if (Array.isArray(response.data)) {
            setFilteredTeams(response.data);
          } else {
            setFilteredTeams([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching teams:", error);
          setFilteredTeams([]);
        });
    } else {
      setFilteredTeams([]);
    }
  }, [teamSearchQuery]);

  const handleTeamSelect = (team) => {
    if (!selectedTeams.some((t) => t.id === team.id)) {
      setSelectedTeams([...selectedTeams, team]);
    }
    setTeamSearchQuery("");
    setFilteredTeams([]);
  };

  const handleTeamRemove = (teamId) => {
    setSelectedTeams(selectedTeams.filter((team) => team.id !== teamId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");
    try {
      const groupResponse = await axios.post(
        "http://localhost:8080/api/leagueGroups/add",
        { name: groupName, leagueId: selectedLeague.id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const groupId = groupResponse.data.id;

      const teamIds = selectedTeams.map((team) => team.id);
      await axios.post(
        `http://localhost:8080/api/teamGroupMembership/group/${groupId}/assign`,
        teamIds,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Group and teams added successfully");
      setGroupName("");
      setSelectedLeague(null);
      setSelectedTeams([]);
    } catch (error) {
      console.error("Error adding group or assigning teams:", error);
      alert("Failed to add group or assign teams");
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Add Group</h1>
      <Form
        onSubmit={handleSubmit}
        className="p-4 border rounded shadow-sm bg-light"
      >
        <Form.Group controlId="formGroupName" className="mb-3">
          <Form.Label>Group Name</Form.Label>
          <Form.Control
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formLeague" className="mb-3">
          <Form.Label>League</Form.Label>
          <Button
            variant="outline-primary"
            onClick={handleOpenLeagueModal}
            className="w-100"
          >
            {selectedLeague
              ? `${selectedLeague.name} (${selectedLeague.country?.name || "Unknown Country"}, Edition: ${selectedLeague.edition})`
              : "Select League"}
          </Button>
        </Form.Group>

        <Form.Group controlId="formTeamSearch" className="mb-3">
          <Form.Label>Teams</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search for a team"
            value={teamSearchQuery}
            onChange={(e) => setTeamSearchQuery(e.target.value)}
          />
          {filteredTeams.length > 0 && (
            <ListGroup>
              {filteredTeams.map((team) => (
                <ListGroup.Item
                  key={team.id}
                  action
                  onClick={() => handleTeamSelect(team)}
                >
                  {team.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          <ListGroup className="mt-2">
            {selectedTeams.map((team) => (
              <ListGroup.Item key={team.id}>
                {team.name}
                <Button
                  variant="danger"
                  size="sm"
                  className="float-end"
                  onClick={() => handleTeamRemove(team.id)}
                >
                  Remove
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mt-3">
          Add Group
        </Button>
      </Form>

      {/* League Selection Modal */}
      <Modal
        show={showLeagueModal}
        onHide={() => setShowLeagueModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Select League</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!selectedCountry && (
            <>
              <h5>Select Country</h5>
              <ListGroup>
                {countries.map((country) => (
                  <ListGroup.Item
                    key={country}
                    action
                    onClick={() => handleSelectCountry(country)}
                  >
                    {country}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
          {selectedCountry && !selectedLeagueName && (
            <>
              <h5>Select League in {selectedCountry}</h5>
              <ListGroup>
                {leagues.map((league) => (
                  <ListGroup.Item
                    key={league.name}
                    action
                    onClick={() => handleSelectLeagueName(league.name)}
                  >
                    {league.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
          {selectedLeagueName && !selectedEdition && (
            <>
              <h5>Select Edition for {selectedLeagueName}</h5>
              <ListGroup>
                {editions.map((edition) => (
                  <ListGroup.Item
                    key={edition}
                    action
                    onClick={() => handleSelectEdition(edition)}
                  >
                    Edition: {edition}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AddGroupForm;
