package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.pollub.footballapp.model.*;
import pl.pollub.footballapp.repository.FavoriteMatchRepository;
import pl.pollub.footballapp.repository.MatchRepository;
import pl.pollub.footballapp.repository.UserRepository;

@Service
public class FavoriteMatchService {
    private FavoriteMatchRepository favoriteMatchRepository;
    private UserRepository userRepository;
    private MatchRepository matchRepository;

    @Autowired
    public FavoriteMatchService(FavoriteMatchRepository favoriteMatchRepository, UserRepository userRepository, MatchRepository matchRepository) {
        this.favoriteMatchRepository = favoriteMatchRepository;
        this.userRepository = userRepository;
        this.matchRepository = matchRepository;
    }


    @Transactional
    public FavoriteMatch addFavoriteMatch(FavoriteMatch favoriteMatch, Long userId, Long matchId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Match match = matchRepository.findById(matchId).orElseThrow(() -> new RuntimeException("Match not found"));

        favoriteMatch.setUser(user);
        favoriteMatch.setMatch(match);

        return favoriteMatchRepository.save(favoriteMatch);
    }

    public void removeFavoriteMatch(Long userId, Long matchId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Match match = matchRepository.findById(matchId).orElseThrow(() -> new RuntimeException("Match not found"));

        FavoriteMatch favoritematch = favoriteMatchRepository.findByUserAndMatch(user, match)
                .orElseThrow(() -> new RuntimeException("Favorite match not found"));

        favoriteMatchRepository.delete(favoritematch);
    }
}
