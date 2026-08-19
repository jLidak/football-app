package pl.pollub.footballapp.model;

import jakarta.persistence.*;

@Entity
public class TeamGroupMembership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private LeagueGroup group;

    public TeamGroupMembership() {
    }

    public TeamGroupMembership(Team team, LeagueGroup group) {
        this.team = team;
        this.group = group;
    }

    // Gettery i settery
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public LeagueGroup getGroup() {
        return group;
    }

    public void setGroup(LeagueGroup group) {
        this.group = group;
    }

    public void setGroupId(Long groupId) {
    }

    public void setTeamId(Long teamId) {
    }

    public Long getTeamId() {
        return team != null ? team.getId() : null;
    }
}
