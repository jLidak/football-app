package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.model.FavoriteTeam;
import pl.pollub.footballapp.model.FavoriteLeague;
import pl.pollub.footballapp.model.FavoriteMatch;
import pl.pollub.footballapp.repository.FavoriteTeamRepository;
import pl.pollub.footballapp.repository.FavoriteLeagueRepository;
import pl.pollub.footballapp.repository.FavoriteMatchRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FavoriteService {
    private FavoriteTeamRepository favoriteTeamRepository;
    private FavoriteLeagueRepository favoriteLeagueRepository;
    private FavoriteMatchRepository favoriteMatchRepository;

    @Autowired
    public FavoriteService(FavoriteTeamRepository favoriteTeamRepository, FavoriteLeagueRepository favoriteLeagueRepository, FavoriteMatchRepository favoriteMatchRepository) {
        this.favoriteTeamRepository = favoriteTeamRepository;
        this.favoriteLeagueRepository = favoriteLeagueRepository;
        this.favoriteMatchRepository = favoriteMatchRepository;
    }


//    public List<FavoriteTeam> getFavoriteTeamsByUserId(Long userId) {
//        return favoriteTeamRepository.findFavoriteTeamsByUserId(userId);
//    }
//
//    public List<FavoriteLeague> getFavoriteLeaguesByUserId(Long userId) {
//        return favoriteLeagueRepository.findFavoriteLeaguesByUserId(userId);
//    }
//
//    public List<FavoriteMatch> getFavoriteMatchesByUserId(Long userId) {
//        return favoriteMatchRepository.findFavoriteMatchesByUserId(userId);
//    }

    public ResponseEntity<Map<String, List<?>>> getUserFavorites(Long userId) {
        Map<String, List<?>> favorites = new HashMap<>();
        favorites.put("teams", favoriteTeamRepository.findFavoriteTeamsByUserId(userId));
        favorites.put("leagues", favoriteLeagueRepository.findFavoriteLeaguesByUserId(userId));
        favorites.put("matches", favoriteMatchRepository.findFavoriteMatchesByUserId(userId));
        return ResponseEntity.ok(favorites);
    }
}
