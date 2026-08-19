package pl.pollub.footballapp.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.model.*;
import pl.pollub.footballapp.repository.*;
import pl.pollub.footballapp.requests.TeamRequest;
import pl.pollub.footballapp.service.importer.DataImporter;
import pl.pollub.footballapp.service.importer.ImporterFactory;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TeamService {
    private TeamRepository teamRepository;
    private LeagueRepository leagueRepository;
    private ImporterFactory importerFactory;
    private FileStorageService fileStorageService;

    private static final Logger logger = LoggerFactory.getLogger(TeamService.class);

    @Autowired
    public TeamService(TeamRepository teamRepository, LeagueRepository leagueRepository, ImporterFactory importerFactory, FileStorageService fileStorageService) {
        this.teamRepository = teamRepository;
        this.leagueRepository = leagueRepository;
        this.importerFactory = importerFactory;
        this.fileStorageService = fileStorageService;
    }


    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private LeagueGroupRepository leagueGroupRepository;
    @Autowired
    private TeamGroupMembershipRepository teamGroupMembershipRepository;

    public String addTeam(TeamRequest teamRequest) {
        League league = leagueRepository.findById(teamRequest.getLeagueId())
                .orElseThrow(() -> new RuntimeException("League not found"));

        if (teamRepository.existsByNameAndLeague(teamRequest.getName(), league)) {
            throw new IllegalArgumentException("Team already exists in this league");
        }

        Team team = new Team();
        team.setName(teamRequest.getName());
        team.setPicture(teamRequest.getPicture());
        team.setIsClub(teamRequest.isClub());
        team.setLeague(league);

        teamRepository.save(team);
        return "Team added successfully";
    }


    public ResponseEntity<?> importTeams(MultipartFile file, String fileType) throws IOException {
        DataImporter importer = importerFactory.getImporterTeam(fileType);
        List<TeamRequest> teamRequests = importer.importData(file.getInputStream());

        List<Integer> duplicateRows = new ArrayList<>();
        int rowNumber = 1;

        for (TeamRequest teamRequest : teamRequests) {
            League league = leagueRepository.findById(teamRequest.getLeagueId())
                    .orElseThrow(() -> new RuntimeException("League not found: " + teamRequest.getLeagueId()));

            boolean isDuplicate = teamRepository.existsByNameAndLeague(teamRequest.getName(), league);

            if (!isDuplicate) {
                Team team = new Team();
                team.setName(teamRequest.getName());
                team.setIsClub(teamRequest.isClub());
                team.setLeague(league);

                teamRepository.save(team);
            } else {
                duplicateRows.add(rowNumber);
            }
            rowNumber++;
        }

        String message = "Teams imported successfully.";
        if (!duplicateRows.isEmpty()) {
            message += " The following records were not added due to duplicates: " + duplicateRows;
        }

        return ResponseEntity.ok(message);
    }

    public List<Team> searchTeams(String query) {
        Sort sortById = Sort.by(Sort.Direction.ASC, "id");
        String normalizedQuery = query.trim().toLowerCase();
        return teamRepository.findByNameContaining(normalizedQuery, sortById);
    }


    public ResponseEntity<?> addTeamAndGetId(TeamRequest teamRequest, MultipartFile picture) throws IOException {
        // Search if league exists
        Optional<League> league = Optional.empty();
        if (teamRequest.getLeagueId() != null) {
            league = leagueRepository.findById(teamRequest.getLeagueId());
            if (league.isEmpty()) {
                return ResponseEntity.badRequest().body("League not found");
            }
        }

        if (league.isPresent() && teamRepository.existsByNameAndLeague(teamRequest.getName(), league.get())) {
            return ResponseEntity.badRequest().body("Team already exists in this league");
        }

        Team team = new Team();
        team.setName(teamRequest.getName());
        team.setIsClub(teamRequest.isClub());
        league.ifPresent(team::setLeague);

        team = teamRepository.save(team);

        if (picture != null) {
            String photoPath = fileStorageService.saveImage(picture, "team_" + team.getId(), "team");
            team.setPicture(photoPath);
            teamRepository.save(team);  // Save again to update photo path
        }

        return ResponseEntity.ok("Team added successfully with ID: " + team.getId());
    }


    public String updateTeam(Long id, TeamRequest teamRequest) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        League league = leagueRepository.findById(teamRequest.getLeagueId())
                .orElseThrow(() -> new RuntimeException("League not found"));

        team.setName(teamRequest.getName());
        team.setPicture(teamRequest.getPicture());
        team.setLeague(league);

        teamRepository.save(team);
        return "Team updated successfully";
    }

    public String updateTeam(Long id, TeamRequest teamRequest, MultipartFile picture) throws IOException {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        League league = leagueRepository.findById(teamRequest.getLeagueId())
                .orElseThrow(() -> new RuntimeException("League not found"));

        team.setName(teamRequest.getName());
        team.setLeague(league);
        team.setIsClub(teamRequest.isClub());

        // Update picture if new one is provided
        if (picture != null) {
            String photoPath = fileStorageService.saveImage(picture, "team_" + id, "team");
            team.setPicture(photoPath);
        }

        teamRepository.save(team);
        return "Team updated successfully";
    }

    @Transactional

    public void deleteTeamById(Long teamId) {
        if (!teamRepository.existsById(teamId)) {
            throw new IllegalArgumentException("Team not found with ID: " + teamId);
        }
        teamRepository.deleteById(teamId);
    }

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    public Map<Team, Integer> calculateGroupPoints(Long groupId) {
        LeagueGroup group = leagueGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        List<Team> teams = teamRepository.findByGroup(group);
        Map<Team, Integer> points = new HashMap<>();

        for (Team team : teams) {
            List<Match> matches = matchRepository.findByGroupAndHomeTeamOrGroupAndAwayTeam(group, team, group, team);

            int teamPoints = 0;
            for (Match match : matches) {
                if (match.getHomeTeam().equals(team)) {
                    teamPoints += calculatePoints(match.getHomeGoals(), match.getAwayGoals());
                } else if (match.getAwayTeam().equals(team)) {
                    teamPoints += calculatePoints(match.getAwayGoals(), match.getHomeGoals());
                }
            }
            points.put(team, teamPoints);
        }
        return points;
    }

    private int calculatePoints(int teamGoals, int opponentGoals) {
        if (teamGoals > opponentGoals) return 3; // Wygrana
        if (teamGoals == opponentGoals) return 1; // Remis
        return 0; // Przegrana
    }

    public void assignTeamsToGroup(Long groupId, List<Long> teamIds) {
        LeagueGroup group = leagueGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        List<Team> teams = teamRepository.findAllById(teamIds);
        teams.forEach(team -> team.setGroup(group));

        teamRepository.saveAll(teams);
    }

    public List<Map<String, Object>> calculateGroupStatistics(Long groupId) {
        logger.info("Starting statistics calculation for groupId: {}", groupId);

        // Pobierz członkostwa drużyn w grupie
        List<TeamGroupMembership> memberships = teamGroupMembershipRepository.findByGroupId(groupId);
        logger.info("Found memberships for group {}: {}", groupId, memberships);

        if (memberships.isEmpty()) {
            logger.warn("No memberships found for groupId: {}", groupId);
            return Collections.emptyList();
        }

        List<Map<String, Object>> statistics = new ArrayList<>();

        for (TeamGroupMembership membership : memberships) {
            Team team = membership.getTeam();
            logger.info("Processing team: {} (ID: {})", team.getName(), team.getId());
            LeagueGroup group = leagueGroupRepository.findById(groupId)
                    .orElseThrow(() -> new RuntimeException("Group not found"));

            Team teamEntity = teamRepository.findById(team.getId())
                    .orElseThrow(() -> new RuntimeException("Team not found"));

            List<Match> matches = matchRepository.findByGroupAndHomeTeamOrGroupAndAwayTeam(group, teamEntity);

            // Pobierz mecze
            logger.info("Matches for team {} in group {}: {}", team.getName(), groupId, matches);

            int played = matches.size();
            int won = 0, drawn = 0, lost = 0;
            int goalsScored = 0, goalsConceded = 0;

            for (Match match : matches) {
                if (match.getHomeTeam().equals(team)) {
                    goalsScored += match.getHomeGoals();
                    goalsConceded += match.getAwayGoals();
                    if (match.getHomeGoals() > match.getAwayGoals()) won++;
                    else if (match.getHomeGoals() == match.getAwayGoals()) drawn++;
                    else lost++;
                } else if (match.getAwayTeam().equals(team)) {
                    goalsScored += match.getAwayGoals();
                    goalsConceded += match.getHomeGoals();
                    if (match.getAwayGoals() > match.getHomeGoals()) won++;
                    else if (match.getAwayGoals() == match.getHomeGoals()) drawn++;
                    else lost++;
                }
            }

            int points = won * 3 + drawn;

            Map<String, Object> teamStats = new HashMap<>();
            teamStats.put("team", team);
            teamStats.put("played", played);
            teamStats.put("won", won);
            teamStats.put("drawn", drawn);
            teamStats.put("lost", lost);
            teamStats.put("goalsScored", goalsScored);
            teamStats.put("goalsConceded", goalsConceded);
            teamStats.put("goalDifference", goalsScored - goalsConceded);
            teamStats.put("points", points);

            logger.info("Calculated stats for team {}: {}", team.getName(), teamStats);

            statistics.add(teamStats);
        }

        // Sortowanie statystyk
        statistics.sort((a, b) -> {
            int pointsDiff = (int) b.get("points") - (int) a.get("points");
            if (pointsDiff != 0) return pointsDiff;
            return (int) b.get("goalDifference") - (int) a.get("goalDifference");
        });

        logger.info("Final sorted statistics for group {}: {}", groupId, statistics);
        return statistics;
    }

    public List<Team> searchTeamsByName(String name) {
        return teamRepository.findByNameContainingIgnoreCase(name);
    }


    public Optional<Team> getTeamById(Long id) {
        return teamRepository.findById(id);
    }
}
