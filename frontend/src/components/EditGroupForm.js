import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, ListGroup, Modal } from "react-bootstrap";

const EditGroupForm = () => {
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [showLeagueModal, setShowLeagueModal] = useState(false);
  const [countries, setCountries] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [groups, setGroups] = useState([]);
  const [editions, setEditions] = useState([]); // Poprawione: dodanie edycji

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedLeagueName, setSelectedLeagueName] = useState(null);
  const [selectedEdition, setSelectedEdition] = useState(null);

  // Pobranie krajów i inicjalizacja modala
  const handleOpenLeagueModal = () => {
    setSelectedCountry(null);
    setSelectedLeagueName(null);
    setSelectedEdition(null);
    setCountries([]);
    setLeagues([]);
    setGroups([]);
    setEditions([]); // Zresetuj edycje

    const token = localStorage.getItem("jwtToken");
    axios
      .get("http://localhost:8080/api/leagues/countries", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setCountries(response.data))
      .catch((error) => console.error("Error fetching countries:", error));

    setShowLeagueModal(true);
  };

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

  const handleSelectLeagueName = (leagueName) => {
    setSelectedLeagueName(leagueName);
    setSelectedEdition(null);

    const token = localStorage.getItem("jwtToken");
    axios
      .get(
        `http://localhost:8080/api/leagues/editions?leagueName=${leagueName}&country=${selectedCountry}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((response) => setEditions(response.data)) // Poprawiono: ustaw edycje
      .catch((error) => console.error("Error fetching editions:", error));
  };

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

        // Pobierz grupy dla wybranej ligi
        axios
          .get(
            `http://localhost:8080/api/leagueGroups/league/${response.data.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )
          .then((groupResponse) => {
            console.log("Fetched groups:", groupResponse.data); // Log danych
            setGroups(groupResponse.data);
          })
          .catch((error) => {
            console.error(
              "Error fetching groups:",
              error.response || error.message,
            );
            alert("Failed to fetch groups for the selected league.");
          });

        setShowLeagueModal(false);
      })
      .catch((error) => {
        console.error("Error fetching league by details:", error);
        alert("Failed to fetch league details");
      });
  };

  const handleGroupSelect = (group, e) => {
    console.log("Group selected:", group); // Debug log

    setSelectedGroup(group);
    setGroupName(group.name);

    const token = localStorage.getItem("jwtToken");
    axios
      .get(
        `http://localhost:8080/api/teamGroupMembership/group/${group.id}/teams`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((response) => {
        console.log("Fetched Teams for group:", response.data); // Loguj dane z backendu
        setSelectedTeams(response.data);
      })
      .catch((error) =>
        console.error("Error fetching teams for group:", error),
      );
  };

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
    console.log("handleSubmit called");

    if (!selectedGroup) {
      alert("Please select a group before saving changes.");
      return;
    }

    const token = localStorage.getItem("jwtToken");
    try {
      // Edycja grupy
      await axios.put(
        `http://localhost:8080/api/leagueGroups/${selectedGroup.id}/edit`,
        { name: groupName, leagueId: selectedLeague.id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Aktualizacja drużyn w grupie
      const teamIds = selectedTeams.map((team) => team.id);
      console.log("Updated Team IDs to send:", teamIds); // Dodaj log, aby sprawdzić dane

      const response = await axios.post(
        `http://localhost:8080/api/teamGroupMembership/group/${selectedGroup.id}/assign`,
        teamIds,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log("API response:", response.data);
      alert("Group updated successfully");
    } catch (error) {
      console.error("Error updating group or assigning teams:", error);
      alert("Failed to update group or assign teams");
    }
  };

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

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Edit Group</h1>
      <Form
        onSubmit={(e) => {
          e.preventDefault(); // Zatrzymuje domyślne wysyłanie formularza
          console.log("Form submitted, selectedGroup:", selectedGroup);
          if (selectedGroup) handleSubmit(e); // Zapobiega wywołaniu, gdy grupa nie jest wybrana
        }}

        className="p-4 border rounded shadow-sm bg-light"
      >
        <Form.Group controlId="formLeague" className="mb-3">
          <Form.Label>League</Form.Label>
          <Button
            variant="outline-primary"
            onClick={handleOpenLeagueModal}
            className="w-100"
            type="button" // Dodano type="button"
          >
            {selectedLeague
              ? `${selectedLeague.name} (${selectedLeague.country?.name || "Unknown Country"}, Edition: ${selectedLeague.edition})`
              : "Select League"}
          </Button>
        </Form.Group>

        {groups.length > 0 && (
          <Form.Group controlId="formGroupSelection" className="mb-3">
            <Form.Label>Select Group</Form.Label>
            <ListGroup>
              {groups.map((group) => (
                <ListGroup.Item
                  key={group.id}
                  action
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default browser action
                    e.stopPropagation(); // Stop the event from bubbling up
                    handleGroupSelect(group);
                  }}
                >
                  {group.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Form.Group>
        )}

        {selectedGroup && (
          <>
            <Form.Group controlId="formGroupName" className="mb-3">
              <Form.Label>Group Name</Form.Label>
              <Form.Control
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault(); // Blokuj domyślne działanie Enter
                }}
                required
              />
            </Form.Group>

            <Form.Group controlId="formTeamSearch" className="mb-3">
              <Form.Label>Teams</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search for a team"
                value={teamSearchQuery}
                onChange={(e) => setTeamSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
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
              Save Changes
            </Button>
          </>
        )}
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

export default EditGroupForm;
