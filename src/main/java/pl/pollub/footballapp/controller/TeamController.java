package pl.pollub.footballapp.controller;

import jakarta.annotation.security.PermitAll;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.model.Team;
import pl.pollub.footballapp.requests.PlayerRequest;
import pl.pollub.footballapp.requests.TeamRequest;
import pl.pollub.footballapp.service.TeamService;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/teams")
public class TeamController {
    private TeamService teamService;
    private static final Logger logger = LoggerFactory.getLogger(TeamController.class);

    @Autowired
    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> addTeam(
            @RequestParam("name") String name,
            @RequestParam("isClub") boolean isClub,
            @RequestParam("leagueId") Long leagueId,
            @RequestParam(value = "picture", required = false) MultipartFile picture) {

        TeamRequest teamRequest = new TeamRequest(name, isClub, leagueId);

        try {
            // Check if team exists and save new team
            ResponseEntity<?> response = teamService.addTeamAndGetId(teamRequest, picture);
            return response; // Return request from service
        } catch (IOException e) {
            // Errors with file
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving picture: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            // Other errors
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> updateTeam(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("isClub") boolean isClub,
            @RequestParam("leagueId") Long leagueId,
            @RequestParam(value = "picture", required = false) MultipartFile picture) {
        try {
            TeamRequest teamRequest = new TeamRequest(name, isClub, leagueId);
            String message = teamService.updateTeam(id, teamRequest, picture);
            return ResponseEntity.ok(message);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error saving picture: " + e.getMessage());
        }
    }

    @PostMapping("/import")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> importTeams(@RequestParam("file") MultipartFile file, @RequestParam("type") String fileType) {
        try {
            return teamService.importTeams(file, fileType);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error importing teams: " + e.getMessage());
        }
    }


    @GetMapping("/search")
    @PermitAll
    public ResponseEntity<List<Team>> searchTeams(@RequestParam("query") String query) {
        List<Team> teams = teamService.searchTeams(query);
        return ResponseEntity.ok(teams);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> deleteTeam(@PathVariable Long id) {
        try {
            teamService.deleteTeamById(id);
            return ResponseEntity.ok("Team deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting team: " + e.getMessage());
        }
    }

    @GetMapping
    @PermitAll
    public ResponseEntity<List<Team>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }


    @PostMapping("/group/{groupId}/assign")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<String> assignTeamsToGroup(@PathVariable Long groupId, @RequestBody List<Long> teamIds) {
        teamService.assignTeamsToGroup(groupId, teamIds);
        return ResponseEntity.ok("Teams assigned to group successfully");
    }

    @GetMapping("/group/{groupId}/statistics")
    @PermitAll
    public ResponseEntity<List<Map<String, Object>>> getGroupStatistics(@PathVariable Long groupId) {
        List<Map<String, Object>> statistics = teamService.calculateGroupStatistics(groupId);
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/group/{groupId}/points")
    @PermitAll
    public ResponseEntity<List<Map<String, Object>>> getGroupPoints(@PathVariable Long groupId) {
        logger.info("Received request for group points. GroupId: {}", groupId);
        List<Map<String, Object>> points = teamService.calculateGroupStatistics(groupId);
        if (points.isEmpty()) {
            logger.info("No points calculated for groupId: {}", groupId);
        }
        return ResponseEntity.ok(points);
    }


    @GetMapping("/{id}")
    @PermitAll
    public ResponseEntity<Team> getTeamById(@PathVariable Long id) {
        return teamService.getTeamById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
