package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.model.Ranking;
import pl.pollub.footballapp.model.RankingPoints;
import pl.pollub.footballapp.model.User;
import pl.pollub.footballapp.repository.RankingPointsRepository;
import pl.pollub.footballapp.repository.RankingRepository;
import pl.pollub.footballapp.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RankingPointsService {
    private final RankingPointsRepository rankingPointsRepository;
    private RankingRepository rankingRepository;
    private UserRepository userRepository;
    private NotificationService notificationService;

    @Autowired
    public RankingPointsService(RankingPointsRepository rankingPointsRepository, RankingRepository rankingRepository, UserRepository userRepository, NotificationService notificationService) {
        this.rankingPointsRepository = rankingPointsRepository;
        this.rankingRepository = rankingRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }


    public List<RankingPoints> getRankingPointsByRankingId(Long rankingId) {
        return rankingPointsRepository.findByRankingId(rankingId);
    }

    public List<Map<String, Object>> getRankingPointsMappedByRankingId(Long rankingId) {
        List<RankingPoints> points = getRankingPointsByRankingId(rankingId);

        return points.stream()
                .map(point -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("userName", point.getUser().getUsername());
                    map.put("points", point.getPoints());
                    return map;
                })
                .collect(Collectors.toList());
    }

    public void updateRankingPoints(Long userId, int pointsToAdd) {
        Ranking activeRanking = rankingRepository.findByIsActiveTrue()
                .orElseThrow(() -> new IllegalStateException("No active ranking found"));

        RankingPoints rankingPoints = rankingPointsRepository.findByUserIdAndRankingId(userId, activeRanking.getId())
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new IllegalArgumentException("User not found"));
                    RankingPoints newPoints = new RankingPoints();
//            newPoints.setUser(new User()); // Jeśli User jest relacją ManyToOne, trzeba wczytać obiekt User
                    newPoints.setUser(user);
                    newPoints.setRanking(activeRanking);
                    newPoints.setPoints(0);
                    newPoints.setLastUpdated(LocalDateTime.now());
                    return newPoints;
                });

        // Aktualizuj punkty
        rankingPoints.setPoints(rankingPoints.getPoints() + pointsToAdd);
        rankingPoints.setLastUpdated(LocalDateTime.now());
        rankingPointsRepository.save(rankingPoints);
    }

    public String getUserNameById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        return user.getUsername(); // lub user.getEmail();
    }

}
