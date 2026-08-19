package pl.pollub.footballapp.controller;

import jakarta.annotation.security.PermitAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.Player;
import pl.pollub.footballapp.model.PlayerContract;
import pl.pollub.footballapp.requests.PlayerContractRequest;
import pl.pollub.footballapp.service.PlayerContractService;

import java.util.List;

@RestController
@RequestMapping("/api/player-contracts")
public class PlayerContractController {
    private PlayerContractService playerContractService;

    @Autowired
    public PlayerContractController(PlayerContractService playerContractService) {
        this.playerContractService = playerContractService;
    }


    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> addPlayerContract(@RequestBody PlayerContractRequest request) {
        return playerContractService.addPlayerContract(request);
    }

    @GetMapping("/player/{playerId}")
    @PermitAll
    public List<PlayerContract> getContractsByPlayer(@PathVariable Long playerId) {
        return playerContractService.getContractsByPlayer(playerId);
    }

    @GetMapping("/team/{teamId}")
    @PermitAll
    public List<PlayerContract> getContractsByTeam(@PathVariable Long teamId) {
        return playerContractService.getContractsByTeam(teamId);
    }

    @GetMapping("/{id}")
    @PermitAll
    public ResponseEntity<PlayerContract> getPlayerContractById(@PathVariable Long id) {
        return playerContractService.getPlayerContractById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<PlayerContract> editPlayerContract(@PathVariable Long id, @RequestBody PlayerContractRequest request) {
        return playerContractService.editPlayerContract(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> deletePlayerContract(@PathVariable Long id) {
        playerContractService.deletePlayerContract(id);
        return ResponseEntity.ok("Player contract deleted successfully");
    }


    @GetMapping("/active-players/{teamId}")
    @PermitAll
    public ResponseEntity<List<Player>> getActivePlayersByTeam(@PathVariable Long teamId) {
        List<Player> activePlayers = playerContractService.getActivePlayersByTeam(teamId);
        return ResponseEntity.ok(activePlayers);
    }

    @GetMapping("/all")
    @PermitAll
    public List<PlayerContract> getAllTransfers() {
        return playerContractService.getAllTransfers();
    }

}
