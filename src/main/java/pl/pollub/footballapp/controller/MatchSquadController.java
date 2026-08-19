package pl.pollub.footballapp.controller;

import jakarta.annotation.security.PermitAll;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.Match;
import pl.pollub.footballapp.model.MatchSquad;
import pl.pollub.footballapp.model.Player;
import pl.pollub.footballapp.repository.MatchRepository;
import pl.pollub.footballapp.repository.PlayerRepository;
import pl.pollub.footballapp.requests.MatchSquadRequest;
import pl.pollub.footballapp.service.MatchSquadService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/match-squad")
public class MatchSquadController {
    //    private final MatchSquadService matchSquadService;
//    private PlayerRepository playerRepository;
//    private MatchRepository matchRepository;
//
//    @Autowired
//    public MatchSquadController(MatchSquadService matchSquadService, PlayerRepository playerRepository, MatchRepository matchRepository) {
//        this.matchSquadService = matchSquadService;
//        this.playerRepository = playerRepository;
//        this.matchRepository = matchRepository;
//    }
    private final MatchSquadService matchSquadService;


    @Autowired
    public MatchSquadController(MatchSquadService matchSquadService) {
        this.matchSquadService = matchSquadService;

    }

    private static final Logger log = LoggerFactory.getLogger(MatchSquadService.class);

    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<MatchSquad> addMatchSquad(@RequestBody MatchSquadRequest request) {
        try {
            MatchSquad matchSquad = matchSquadService.createMatchSquad(request);
            return ResponseEntity.ok(matchSquad);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping
    public ResponseEntity<List<MatchSquad>> getAllMatchSquads() {
        return ResponseEntity.ok(matchSquadService.getAllMatchSquads());
    }

    @GetMapping("/{id}")
    @PermitAll
    public ResponseEntity<MatchSquad> getMatchSquadById(@PathVariable Long id) {
        Optional<MatchSquad> matchSquad = matchSquadService.getMatchSquadById(id);
        return matchSquad.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<Void> deleteMatchSquad(@PathVariable Long id) {
        matchSquadService.deleteMatchSquad(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/players/{matchId}")
    @PermitAll
    public ResponseEntity<List<Player>> getPlayersByMatchId(@PathVariable Long matchId) {
        log.debug("Received request for players in matchId: {}", matchId);
        List<Player> players = matchSquadService.getPlayersByMatchId(matchId);
        log.debug("Returning players: {}", players);
        return ResponseEntity.ok(players);
    }

    @GetMapping("/first-squad/{matchId}")
    @PermitAll
    public ResponseEntity<List<Player>> getFirstSquadPlayers(@PathVariable Long matchId) {
        return ResponseEntity.ok(matchSquadService.getFirstSquadPlayers(matchId));
    }

    @GetMapping("/substitutes/{matchId}")
    @PermitAll
    public ResponseEntity<List<Player>> getSubstitutePlayers(@PathVariable Long matchId) {
        return ResponseEntity.ok(matchSquadService.getSubstitutePlayers(matchId));
    }

    // Nowy endpoint do pobierania pierwszej jedenastki z uwzględnieniem homeTeam
    @GetMapping("/first-squad-home/{matchId}")
    @PermitAll
    public ResponseEntity<List<Player>> getFirstSquadPlayersByHomeTeam(
            @PathVariable Long matchId,
            @RequestParam boolean homeTeam) {
        List<Player> players = matchSquadService.getFirstSquadPlayersByHomeTeam(matchId, homeTeam);
        return ResponseEntity.ok(players);
    }

    // Nowy endpoint do pobierania rezerwowych z uwzględnieniem homeTeam
    @GetMapping("/substitutes-home/{matchId}")
    @PermitAll
    public ResponseEntity<List<Player>> getSubstitutePlayersByHomeTeam(
            @PathVariable Long matchId,
            @RequestParam boolean homeTeam) {
        List<Player> players = matchSquadService.getSubstitutePlayersByHomeTeam(matchId, homeTeam);
        return ResponseEntity.ok(players);
    }
}
