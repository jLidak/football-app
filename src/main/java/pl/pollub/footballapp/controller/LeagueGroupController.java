package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.LeagueGroup;
import pl.pollub.footballapp.service.LeagueGroupService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leagueGroups")
@CrossOrigin(origins = "http://localhost:3000")
public class LeagueGroupController {

    @Autowired
    private LeagueGroupService leagueGroupService;

    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<LeagueGroup> addLeagueGroup(@RequestBody Map<String, Object> payload) {
        String name = (String) payload.get("name");
        Long leagueId = ((Number) payload.get("leagueId")).longValue();
        LeagueGroup leagueGroup = leagueGroupService.saveLeagueGroup(name, leagueId);
        return ResponseEntity.ok(leagueGroup);
    }

    @GetMapping("/league/{leagueId}")
    public ResponseEntity<List<LeagueGroup>> getGroupsByLeague(@PathVariable Long leagueId) {
        List<LeagueGroup> groups = leagueGroupService.getGroupsByLeague(leagueId);
        System.out.println("Fetched groups for leagueId " + leagueId + ": " + groups);
        return ResponseEntity.ok(groups);
    }


    @GetMapping
    public ResponseEntity<List<LeagueGroup>> getAllGroups() {
        return ResponseEntity.ok(leagueGroupService.getAllGroups());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeagueGroup> getGroupById(@PathVariable Long id) {
        return leagueGroupService.getGroupById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        leagueGroupService.deleteGroup(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/edit")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<LeagueGroup> editGroup(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload
    ) {
        String name = (String) payload.get("name");
        Long leagueId = ((Number) payload.get("leagueId")).longValue();
        LeagueGroup updatedGroup = leagueGroupService.editLeagueGroup(id, name, leagueId);
        return ResponseEntity.ok(updatedGroup);
    }

}
