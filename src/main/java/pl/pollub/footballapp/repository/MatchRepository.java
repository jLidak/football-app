package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.pollub.footballapp.MatchStatus;
import pl.pollub.footballapp.model.LeagueGroup;
import pl.pollub.footballapp.model.Match;
import pl.pollub.footballapp.model.MatchSquad;
import pl.pollub.footballapp.model.Team;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByStatusIn(List<MatchStatus> statuses);

    @Query("SELECT m FROM Match m WHERE " +
            "LOWER(m.homeTeam.name) LIKE LOWER(CONCAT('%', :teamName, '%')) OR " +
            "LOWER(m.awayTeam.name) LIKE LOWER(CONCAT('%', :teamName, '%'))")
    List<Match> searchByTeamName(@Param("teamName") String teamName);

    @Query("SELECT m FROM Match m WHERE " +
            "LOWER(m.homeTeam.name) LIKE LOWER(CONCAT('%', :teamName, '%')) OR " +
            "LOWER(m.awayTeam.name) LIKE LOWER(CONCAT('%', :teamName, '%'))")
    List<Match> findByTeamName(@Param("teamName") String teamName);

    @Query("SELECT m FROM Match m WHERE " +
            "LOWER(m.homeTeam.name) LIKE LOWER(CONCAT('%', :teamName, '%')) OR " +
            "LOWER(m.awayTeam.name) LIKE LOWER(CONCAT('%', :teamName, '%'))")
    List<Match> findByTeamNameContaining(@Param("teamName") String teamName);

    List<Match> findAllByDateTimeBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);

    List<Match> findByStatus(MatchStatus status);

    List<Match> findByGroupAndHomeTeamOrGroupAndAwayTeam(LeagueGroup group1, Team homeTeam, LeagueGroup group2, Team awayTeam);

    @Query("SELECT m FROM Match m WHERE m.group = :group AND (m.homeTeam = :team OR m.awayTeam = :team)")
    List<Match> findByGroupAndHomeTeamOrGroupAndAwayTeam(LeagueGroup group, Team team);

    List<Match> findByLeagueId(Long leagueId);

    @Query("SELECT m FROM Match m WHERE m.group.id = :groupId AND (m.homeTeam.id = :teamId OR m.awayTeam.id = :teamId)")
    List<Match> findMatchesByGroupAndTeam(@Param("groupId") Long groupId, @Param("teamId") Long teamId);


    @Query("SELECT m FROM Match m WHERE m.league.id = :leagueId AND m.stage.name != :stageName")
    List<Match> findByLeagueIdAndStageNot(@Param("leagueId") Long leagueId, @Param("stageName") String stageName);


    @Query("SELECT m FROM Match m WHERE (m.homeTeam.id = :teamId OR m.awayTeam.id = :teamId) AND m.dateTime < :dateTime ORDER BY m.dateTime DESC")
    List<Match> findByTeamAndDateTimeBefore(Long teamId, LocalDateTime dateTime);

    @Query("SELECT m FROM Match m WHERE (m.homeTeam.id = :teamId OR m.awayTeam.id = :teamId) AND m.dateTime > :dateTime ORDER BY m.dateTime ASC")
    List<Match> findByTeamAndDateTimeAfter(Long teamId, LocalDateTime dateTime);

}
