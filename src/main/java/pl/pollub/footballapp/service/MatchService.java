package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.MatchStatus;
import pl.pollub.footballapp.model.Match;
import pl.pollub.footballapp.model.PlayerContract;
import pl.pollub.footballapp.repository.MatchRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class MatchService {
    private final MatchRepository matchRepository;

    @Autowired
    public MatchService(MatchRepository matchRepository) {
        this.matchRepository = matchRepository;
    }


    public Match saveMatch(Match match) {
        return matchRepository.save(match);
    }

    public List<Match> getAllMatches() {
        return matchRepository.findAll();
    }

    public Optional<Match> getMatchById(Long id) {
        return matchRepository.findById(id);
    }

    public void deleteMatch(Long id) {
        matchRepository.deleteById(id);
    }

    public Match updateMatch(Long id, Match updatedMatch) {
        return matchRepository.findById(id)
                .map(match -> {
                    match.setHomeTeam(updatedMatch.getHomeTeam());
                    match.setAwayTeam(updatedMatch.getAwayTeam());
                    match.setDateTime(updatedMatch.getDateTime());
                    match.setReferee(updatedMatch.getReferee());
                    match.setStadium(updatedMatch.getStadium());
                    match.setLeague(updatedMatch.getLeague());
                    match.setGroup(updatedMatch.getGroup());
                    match.setStage(updatedMatch.getStage()); // Zmieniono na stage
                    match.setRound(updatedMatch.getRound());
                    match.setDuration(90); // Stała wartość
                    match.setStatus(updatedMatch.getStatus());
                    match.setBetable(updatedMatch.getBetable());


                    match.setHomeGoals(updatedMatch.getHomeGoals());
                    match.setAwayGoals(updatedMatch.getAwayGoals());
                    match.setHomePossession(updatedMatch.getHomePossession());
                    match.setAwayPossession(updatedMatch.getAwayPossession());
                    match.setHomePasses(updatedMatch.getHomePasses());
                    match.setAwayPasses(updatedMatch.getAwayPasses());
                    match.setHomeAccuratePasses(updatedMatch.getHomeAccuratePasses());
                    match.setAwayAccuratePasses(updatedMatch.getAwayAccuratePasses());
                    match.setHomeShots(updatedMatch.getHomeShots());
                    match.setAwayShots(updatedMatch.getAwayShots());
                    match.setHomeShotsOnGoal(updatedMatch.getHomeShotsOnGoal());
                    match.setAwayShotsOnGoal(updatedMatch.getAwayShotsOnGoal());
                    match.setHomeCorners(updatedMatch.getHomeCorners());
                    match.setAwayCorners(updatedMatch.getAwayCorners());
                    match.setHomeOffside(updatedMatch.getHomeOffside());
                    match.setAwayOffside(updatedMatch.getAwayOffside());
                    match.setHomeFouls(updatedMatch.getHomeFouls());
                    match.setAwayFouls(updatedMatch.getAwayFouls());


                    return matchRepository.save(match);
                })
                .orElseThrow(() -> new RuntimeException("Match with ID " + id + " not found"));
    }

//    public Match updateMatch(Long id, Match updatedMatch) {
//        return matchRepository.findById(id)
//                .map(match -> {
//                    match.setDateTime(updatedMatch.getDateTime());
//                    match.setRound(updatedMatch.getRound());
//                    match.setStatus(updatedMatch.getStatus());
//                    match.setHomeTeam(updatedMatch.getHomeTeam());
//                    match.setAwayTeam(updatedMatch.getAwayTeam());
//                    return matchRepository.save(match);
//                })
//                .orElseThrow(() -> new RuntimeException("Match not found with id " + id));
//    }

    public List<Match> findMatchesByTeamName(String teamName) {
        return matchRepository.searchByTeamName(teamName);
    }

    public List<Match> getMatchesByTeamName(String teamName) {
        return matchRepository.searchByTeamName(teamName);
    }

    //    public List<Match> searchMatchesByTeamName(String teamName) {
//        return matchRepository.findByTeamNameContaining(teamName);
//    }
    public List<Match> getMatchesByDate(LocalDate date) {
        // Zakres od początku dnia do końca dnia
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        return matchRepository.findAllByDateTimeBetween(startOfDay, endOfDay);
    }

    public List<Match> searchMatchesByTeamName(String teamName) {
        return matchRepository.findByTeamName(teamName);
    }

    public List<Match> getMatchesByLeague(Long leagueId) {
        return matchRepository.findByLeagueId(leagueId);
    }

    public List<Match> findKnockoutMatches(Long leagueId) {
        return matchRepository.findByLeagueIdAndStageNot(leagueId, "GROUP");
    }


    public List<Match> getRecentMatchesByTeam(Long teamId) {
        LocalDateTime now = LocalDateTime.now();
        return matchRepository.findByTeamAndDateTimeBefore(teamId, now);
    }

    public List<Match> getUpcomingMatchesByTeam(Long teamId) {
        LocalDateTime now = LocalDateTime.now();
        return matchRepository.findByTeamAndDateTimeAfter(teamId, now);
    }
}
