package pl.pollub.footballapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class LeagueGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    private League league;

    @JsonIgnore
    @OneToMany(mappedBy = "group")
    private List<TeamGroupMembership> teamGroupMemberships;


    public LeagueGroup() {
    }

    public LeagueGroup(String name) {
        this.name = name;
    }

    // Gettery i settery

    @JsonIgnore
    @OneToMany(mappedBy = "group")
    private List<Team> teams;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public League getLeague() {
        return league;
    }

    public void setLeague(League league) {
        this.league = league;
    }


    public List<TeamGroupMembership> getTeamGroupMemberships() {
        return teamGroupMemberships;
    }

    public void setTeamGroupMemberships(List<TeamGroupMembership> teamGroupMemberships) {
        this.teamGroupMemberships = teamGroupMemberships;
    }
}
