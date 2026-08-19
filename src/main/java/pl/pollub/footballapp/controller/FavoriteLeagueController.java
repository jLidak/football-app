package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.service.FavoriteLeagueService;

import java.util.Map;

@RestController
@RequestMapping("/api/favorite-leagues")
public class FavoriteLeagueController {
    private FavoriteLeagueService favoriteLeagueService;

    @Autowired
    public FavoriteLeagueController(FavoriteLeagueService favoriteLeagueService) {
        this.favoriteLeagueService = favoriteLeagueService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addFavoriteLeague(@RequestBody Map<String, Long> payload) {
        Long userId = payload.get("userId");
        Long leagueId = payload.get("leagueId");

        favoriteLeagueService.addFavoriteLeague(userId, leagueId);

        return ResponseEntity.ok("League added to favorites");
    }

    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFavoriteLeague(@RequestBody Map<String, Long> payload) {
        Long userId = payload.get("userId");
        Long leagueId = payload.get("leagueId");

        favoriteLeagueService.removeFavoriteLeague(userId, leagueId);

        return ResponseEntity.ok("League removed from favorites");
    }
}
