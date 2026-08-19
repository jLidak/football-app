package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.pollub.footballapp.model.LeagueGroup;
import pl.pollub.footballapp.model.Match;
import pl.pollub.footballapp.model.Team;
import pl.pollub.footballapp.model.TeamGroupMembership;
import pl.pollub.footballapp.repository.LeagueGroupRepository;
import pl.pollub.footballapp.repository.MatchRepository;
import pl.pollub.footballapp.repository.TeamGroupMembershipRepository;
import pl.pollub.footballapp.repository.TeamRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TeamGroupMembershipService {

    @Autowired
    private TeamGroupMembershipRepository membershipRepository;

    @Autowired
    private LeagueGroupRepository leagueGroupRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private TeamGroupMembershipRepository teamGroupMembershipRepository;

    @Transactional
    public void assignTeamsToGroup(Long groupId, List<Long> teamIds) {
        // Pobierz istniejące przypisania zespołów do grupy
        List<Long> existingTeamIds = teamGroupMembershipRepository.findByGroupId(groupId)
                .stream()
                .map(TeamGroupMembership::getTeamId)
                .collect(Collectors.toList());

        // Usuń drużyny, które już nie należą do grupy
        List<Long> teamsToRemove = existingTeamIds.stream()
                .filter(id -> !teamIds.contains(id)) // Jeśli drużyny nie ma już na liście, usuń ją
                .collect(Collectors.toList());
        if (!teamsToRemove.isEmpty()) {
            teamGroupMembershipRepository.deleteByGroupIdAndTeamIds(groupId, teamsToRemove);
        }

        // Dodaj drużyny, które jeszcze nie są przypisane do grupy
        List<Long> teamsToAdd = teamIds.stream()
                .filter(id -> !existingTeamIds.contains(id)) // Jeśli drużyny jeszcze nie ma na liście, dodaj ją
                .collect(Collectors.toList());
        if (!teamsToAdd.isEmpty()) {
            teamsToAdd.forEach(teamId -> {
                Team team = teamRepository.findById(teamId)
                        .orElseThrow(() -> new IllegalArgumentException("Team not found with id: " + teamId));
                LeagueGroup group = leagueGroupRepository.findById(groupId)
                        .orElseThrow(() -> new IllegalArgumentException("Group not found with id: " + groupId));
                TeamGroupMembership membership = new TeamGroupMembership();
                membership.setTeam(team);
                membership.setGroup(group);
                teamGroupMembershipRepository.save(membership);
            });
        }
    }


    public Map<Team, Integer> calculateGroupPoints(Long groupId) {
        LeagueGroup group = leagueGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        List<TeamGroupMembership> memberships = membershipRepository.findByGroup(group);
        Map<Team, Integer> points = new HashMap<>();

        for (TeamGroupMembership membership : memberships) {
            Team team = membership.getTeam();
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

    public List<Team> getTeamsByGroup(Long groupId) {
        return teamGroupMembershipRepository.findTeamsByGroupId(groupId);
    }

}
