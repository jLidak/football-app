package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.FavoriteMatch;
import pl.pollub.footballapp.service.FavoriteMatchService;

import java.util.Map;

@RestController
@RequestMapping("/api/favorite-matches")
public class FavoriteMatchController {
    private FavoriteMatchService favoriteMatchService;

    @Autowired
    public FavoriteMatchController(FavoriteMatchService favoriteMatchService) {
        this.favoriteMatchService = favoriteMatchService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addFavoriteMatch(@RequestBody Map<String, Long> payload) {
        Long userId = payload.get("userId");
        Long matchId = payload.get("matchId");

        FavoriteMatch favoriteMatch = new FavoriteMatch();
        favoriteMatchService.addFavoriteMatch(favoriteMatch, userId, matchId);

        return ResponseEntity.ok("Match added to favorites");
    }

    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFavoriteMatch(@RequestBody Map<String, Long> payload) {
        Long userId = payload.get("userId");
        Long matchId = payload.get("matchId");

        favoriteMatchService.removeFavoriteMatch(userId, matchId);

        return ResponseEntity.ok("Match removed from favorites");
    }
}
