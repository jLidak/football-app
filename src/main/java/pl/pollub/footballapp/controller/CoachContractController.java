package pl.pollub.footballapp.controller;

import jakarta.annotation.security.PermitAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.CoachContract;
import pl.pollub.footballapp.requests.CoachContractRequest;
import pl.pollub.footballapp.service.CoachContractService;

import java.util.List;

@RestController
@RequestMapping("/api/coach-contracts")
public class CoachContractController {
    private CoachContractService coachContractService;

    @Autowired
    public CoachContractController(CoachContractService coachContractService) {
        this.coachContractService = coachContractService;
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> addCoachContract(@RequestBody CoachContractRequest request) {
        return coachContractService.addCoachContract(request);
    }

    @GetMapping("/coach/{coachId}")
    @PermitAll
    public List<CoachContract> getContractsByCoach(@PathVariable Long coachId) {
        return coachContractService.getContractsByCoach(coachId);
    }

    @GetMapping("/team/{teamId}")
    @PermitAll
    public List<CoachContract> getContractsByTeam(@PathVariable Long teamId) {
        return coachContractService.getContractsByTeam(teamId);
    }

    @GetMapping("/{id}")
    @PermitAll
    public ResponseEntity<CoachContract> getCoachContractById(@PathVariable Long id) {
        return coachContractService.getCoachContractById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<CoachContract> editCoachContract(@PathVariable Long id, @RequestBody CoachContractRequest request) {
        return coachContractService.editCoachContract(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> deleteCoachContract(@PathVariable Long id) {
        return coachContractService.deleteCoachContract(id);
    }


    @GetMapping("/team/{teamId}/current-coach")
    @PermitAll
    public ResponseEntity<CoachContract> getCurrentCoachByTeam(@PathVariable Long teamId) {
        return coachContractService.getCurrentCoachByTeam(teamId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }
}
