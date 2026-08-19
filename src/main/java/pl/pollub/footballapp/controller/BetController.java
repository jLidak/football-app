package pl.pollub.footballapp.controller;

import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.Bet;
import pl.pollub.footballapp.model.FavoriteMatch;
import pl.pollub.footballapp.repository.BetRepository;
import pl.pollub.footballapp.requests.BetRequest;
import pl.pollub.footballapp.requests.RefereeRequest;
import pl.pollub.footballapp.service.BetService;
import pl.pollub.footballapp.service.MatchService;
import pl.pollub.footballapp.service.UserService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bets")
public class BetController {

    private BetService betService;
    private BetRepository betRepository;

    @Autowired
    public BetController(BetService betService, BetRepository betRepository) {
        this.betService = betService;
        this.betRepository = betRepository;
    }


    @GetMapping("/{id}")
    public ResponseEntity<Bet> getBetById(@PathVariable Long id) {
        return ResponseEntity.ok(betService.getBetById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBet(@PathVariable Long id) {
        betService.deleteBet(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/add")
    public ResponseEntity<?> addBet(@RequestBody BetRequest request) {
        return betService.addBet(request);
    }


    //@PostMapping("/check/{matchId}")
    @PostMapping("/check")
    public ResponseEntity<String> checkBetResults(@RequestParam Long matchId) {
        betService.checkBetResults(matchId);
        return ResponseEntity.ok("Bet results checked successfully.");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Bet>> getUserBets(@PathVariable Long userId) {
        List<Bet> bets = betService.getUserBets(userId);
        return ResponseEntity.ok(bets);
    }


    /// ///////////////////
    @PostMapping("/verify/{matchId}")
    public ResponseEntity<?> verifyBetsForMatch(@PathVariable Long matchId, @RequestParam int actualHomeScore, @RequestParam int actualAwayScore) {
        betService.checkBetsForMatch(matchId, actualHomeScore, actualAwayScore);
        return ResponseEntity.ok("Bets verified successfully");
    }

    @GetMapping("/points/{userId}")
    public ResponseEntity<Integer> getUserPoints(@PathVariable Long userId) {
        return ResponseEntity.ok(betService.getUserPoints(userId));
    }
}
