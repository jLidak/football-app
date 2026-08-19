package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.pollub.footballapp.model.FavoriteTeam;
import pl.pollub.footballapp.model.Team;
import pl.pollub.footballapp.model.User;
import pl.pollub.footballapp.repository.FavoriteTeamRepository;
import pl.pollub.footballapp.repository.TeamRepository;
import pl.pollub.footballapp.repository.UserRepository;

import java.util.Optional;

@Service
public class FavoriteTeamService {
    private FavoriteTeamRepository favoriteTeamRepository;
    private UserRepository userRepository;
    private TeamRepository teamRepository;

    @Autowired
    public FavoriteTeamService(FavoriteTeamRepository favoriteTeamRepository, UserRepository userRepository, TeamRepository teamRepository) {
        this.favoriteTeamRepository = favoriteTeamRepository;
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
    }


    @Transactional
    public FavoriteTeam addFavoriteTeam(Long userId, Long teamId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Team team = teamRepository.findById(teamId).orElseThrow(() -> new RuntimeException("Team not found"));

        // Sprawdzenie, czy ulubiona drużyna już istnieje
        Optional<FavoriteTeam> existingFavorite = favoriteTeamRepository.findByUserAndTeam(user, team);
        if (existingFavorite.isPresent()) {
            throw new RuntimeException("Team is already in favorites");
        }

        FavoriteTeam favoriteTeam = new FavoriteTeam();
        favoriteTeam.setUser(user);
        favoriteTeam.setTeam(team);

        return favoriteTeamRepository.save(favoriteTeam);
    }

    public void removeFavoriteTeam(Long userId, Long teamId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Team team = teamRepository.findById(teamId).orElseThrow(() -> new RuntimeException("Team not found"));

        FavoriteTeam favoriteTeam = favoriteTeamRepository.findByUserAndTeam(user, team)
                .orElseThrow(() -> new RuntimeException("Favorite team not found"));

        favoriteTeamRepository.delete(favoriteTeam);
    }
}
