package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.service.FavoriteTeamService;

import java.util.Map;

@RestController
@RequestMapping("/api/favorite-teams")
public class FavoriteTeamController {
    private FavoriteTeamService favoriteTeamService;

    @Autowired
    public FavoriteTeamController(FavoriteTeamService favoriteTeamService) {
        this.favoriteTeamService = favoriteTeamService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addFavoriteTeam(@RequestBody Map<String, Long> payload) {
        Long userId = payload.get("userId");
        Long teamId = payload.get("teamId");

        favoriteTeamService.addFavoriteTeam(userId, teamId);

        return ResponseEntity.ok("Team added to favorites");
    }

    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFavoriteTeam(@RequestBody Map<String, Long> payload) {
        Long userId = payload.get("userId");
        Long teamId = payload.get("teamId");

        favoriteTeamService.removeFavoriteTeam(userId, teamId);

        return ResponseEntity.ok("Team removed from favorites");
    }
}
