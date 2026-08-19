package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.model.League;
import pl.pollub.footballapp.model.LeagueGroup;
import pl.pollub.footballapp.repository.LeagueGroupRepository;
import pl.pollub.footballapp.repository.LeagueRepository;

import java.util.List;
import java.util.Optional;

@Service
public class LeagueGroupService {

    @Autowired
    private LeagueGroupRepository leagueGroupRepository;

    @Autowired
    private LeagueRepository leagueRepository;

    public LeagueGroup saveLeagueGroup(String name, Long leagueId) {
        League league = leagueRepository.findById(leagueId)
                .orElseThrow(() -> new RuntimeException("League not found"));

        LeagueGroup leagueGroup = new LeagueGroup();
        leagueGroup.setName(name);
        leagueGroup.setLeague(league);

        return leagueGroupRepository.save(leagueGroup);
    }

    public List<LeagueGroup> getAllGroups() {
        return leagueGroupRepository.findAll();
    }

    public Optional<LeagueGroup> getGroupById(Long id) {
        return leagueGroupRepository.findById(id);
    }

    public void deleteGroup(Long id) {
        leagueGroupRepository.deleteById(id);
    }

    public List<LeagueGroup> getGroupsByLeague(Long leagueId) {
        List<LeagueGroup> groups = leagueGroupRepository.findByLeagueId(leagueId);
        System.out.println("Groups found for leagueId " + leagueId + ": " + groups);
        return groups;
    }

    public LeagueGroup editLeagueGroup(Long groupId, String name, Long leagueId) {
        LeagueGroup group = leagueGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        group.setName(name);
        group.setLeague(leagueRepository.findById(leagueId)
                .orElseThrow(() -> new RuntimeException("League not found")));
        return leagueGroupRepository.save(group);
    }

}
