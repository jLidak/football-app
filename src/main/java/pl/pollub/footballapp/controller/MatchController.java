package pl.pollub.footballapp.controller;

import jakarta.annotation.security.PermitAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.League;
import pl.pollub.footballapp.model.Match;
import pl.pollub.footballapp.model.PlayerContract;
import pl.pollub.footballapp.repository.LeagueRepository;
import pl.pollub.footballapp.repository.RefereeRepository;
import pl.pollub.footballapp.repository.StadiumRepository;
import pl.pollub.footballapp.repository.TeamRepository;
import pl.pollub.footballapp.service.LeagueService;
import pl.pollub.footballapp.service.MatchService;
import pl.pollub.footballapp.service.RefereeService;
import pl.pollub.footballapp.service.StadiumService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchController {
    private final MatchService matchService;

    @Autowired
    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @Autowired
    private LeagueRepository leagueRepository;

    @Autowired
    private RefereeRepository refereeRepository;

    @Autowired
    private StadiumRepository stadiumRepository;

    @Autowired
    private TeamRepository teamRepository;


    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<Long> addMatch(@RequestBody Match match) {
        System.out.println("Received Match object: " + match);


        League league = leagueRepository.findById(match.getLeague().getId())
                .orElseThrow(() -> new RuntimeException("League not found"));
        match.setLeague(league);

        // Analogicznie, załaduj inne zależne encje, jeśli występują
        match.setReferee(refereeRepository.findById(match.getReferee().getId())
                .orElseThrow(() -> new RuntimeException("Referee not found")));
        match.setStadium(stadiumRepository.findById(match.getStadium().getId())
                .orElseThrow(() -> new RuntimeException("Stadium not found")));
        match.setHomeTeam(teamRepository.findById(match.getHomeTeam().getId())
                .orElseThrow(() -> new RuntimeException("Home team not found")));
        match.setAwayTeam(teamRepository.findById(match.getAwayTeam().getId())
                .orElseThrow(() -> new RuntimeException("Away team not found")));


        if (!match.getBetable()) {
            System.out.println("BETABLE IS FALSE");
        } else if (match.getBetable()) {
            System.out.println("BETABLE IS TRUE");
        } else if (match.getBetable() == null) {
            System.out.println("BETABLE IS NULL");
        } else {
            System.out.println("BETABLE IS SOMETHING ELSE");
        }

        if (match.getBetable() == null) {
            match.setBetable(false);
        }
        if (!match.getBetable()) {
            System.out.println("BETABLE IS FALSE");
        } else if (match.getBetable()) {
            System.out.println("BETABLE IS TRUE");
        } else if (match.getBetable() == null) {
            System.out.println("BETABLE IS NULL");
        } else {
            System.out.println("BETABLE IS SOMETHING ELSE");
        }

        Match savedMatch = matchService.saveMatch(match);
        return ResponseEntity.ok(savedMatch.getId());
    }


    @GetMapping
    @PermitAll
    public ResponseEntity<List<Match>> getAllMatches() {
        return ResponseEntity.ok(matchService.getAllMatches());
    }

    @GetMapping("/{id}")
    @PermitAll
    public ResponseEntity<Match> getMatchById(@PathVariable Long id) {
        return matchService.getMatchById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

//    @PutMapping("/{id}")
//    @PreAuthorize("hasRole('MODERATOR')")
//    public ResponseEntity<Match> updateMatch(@PathVariable Long id, @RequestBody Match match) {
//        return ResponseEntity.ok(matchService.updateMatch(id, match));
//    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<Void> deleteMatch(@PathVariable Long id) {
        matchService.deleteMatch(id);
        return ResponseEntity.ok().build();
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<Match> updateMatch(@PathVariable Long id, @RequestBody Match updatedMatch) {
        return ResponseEntity.ok(matchService.updateMatch(id, updatedMatch));
    }

//    @GetMapping
//    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN')")
//    public ResponseEntity<List<Match>> getAllMatches() {
//        return ResponseEntity.ok(matchService.getAllMatches());
//    }

//    @GetMapping("/search")
//    public ResponseEntity<List<Match>> searchMatches(@RequestParam String teamName) {
//        List<Match> matches = matchService.findMatchesByTeamName(teamName);
//        return ResponseEntity.ok(matches);
//    }

//    @GetMapping("/search")
//    public ResponseEntity<List<Match>> searchMatches(@RequestParam String query) {
//        List<Match> matches = matchService.searchMatchesByTeamName(query);
//        return ResponseEntity.ok(matches);
//    }

    @GetMapping("/search")
    @PermitAll
    public ResponseEntity<List<Match>> searchMatches(@RequestParam String query) {
        List<Match> matches = matchService.searchMatchesByTeamName(query);
        return ResponseEntity.ok(matches);
    }

//    @GetMapping("/team/{teamId}")
//    @PreAuthorize("hasRole('MODERATOR')")
//    public List<Match> getMatchesByTeam(@PathVariable Long teamId) {
//        return matchService.getMatchesByTeamName(teamId);
//    }

    @GetMapping("/date/{date}")
    @PermitAll
    public ResponseEntity<List<Match>> getMatchesByDate(
            @PathVariable("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Match> matches = matchService.getMatchesByDate(date);
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/league/{leagueId}")
    @PermitAll
    public ResponseEntity<List<Match>> getMatchesByLeague(@PathVariable Long leagueId) {
        List<Match> matches = matchService.getMatchesByLeague(leagueId);
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/knockout/{leagueId}")
    @PermitAll
    public ResponseEntity<List<Match>> getKnockoutMatches(@PathVariable Long leagueId) {
        List<Match> matches = matchService.findKnockoutMatches(leagueId);
        return ResponseEntity.ok(matches);
    }


    @GetMapping("/recent/{teamId}")
    public ResponseEntity<List<Match>> getRecentMatches(@PathVariable Long teamId) {
        List<Match> recentMatches = matchService.getRecentMatchesByTeam(teamId);
        return ResponseEntity.ok(recentMatches);
    }

    @GetMapping("/upcoming/{teamId}")
    public ResponseEntity<List<Match>> getUpcomingMatches(@PathVariable Long teamId) {
        List<Match> upcomingMatches = matchService.getUpcomingMatchesByTeam(teamId);
        return ResponseEntity.ok(upcomingMatches);
    }

}
