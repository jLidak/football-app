package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.pollub.footballapp.model.Bet;
import pl.pollub.footballapp.model.Match;
import pl.pollub.footballapp.model.User;

import java.util.List;

@Repository
public interface BetRepository extends JpaRepository<Bet, Long> {
    List<Bet> findByUserId(Long userId);

    List<Bet> findByMatchId(Long matchId);

    boolean existsByUserAndMatch(User user, Match match);

    int countByUserIdAndIsCorrectTrue(Long userId);

    boolean existsByUserIdAndMatchId(Long userId, Long matchId);

}
