package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.FavoriteTeam;
import pl.pollub.footballapp.model.FavoriteLeague;
import pl.pollub.footballapp.model.FavoriteMatch;
import pl.pollub.footballapp.service.FavoriteService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {
    private FavoriteService favoriteService;

    @Autowired
    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }


//    @GetMapping("/{userId}")
//    public ResponseEntity<Map<String, List<?>>> getUserFavorites(@PathVariable Long userId) {
//        Map<String, List<?>> favorites = new HashMap<>();
//        favorites.put("teams", favoriteService.getFavoriteTeamsByUserId(userId));
//        favorites.put("leagues", favoriteService.getFavoriteLeaguesByUserId(userId));
//        favorites.put("matches", favoriteService.getFavoriteMatchesByUserId(userId));
//
//        return ResponseEntity.ok(favorites);
//    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserFavorites(@PathVariable Long userId) {
        return favoriteService.getUserFavorites(userId);
    }
}
