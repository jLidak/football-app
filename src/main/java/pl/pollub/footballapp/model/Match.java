package pl.pollub.footballapp.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import pl.pollub.footballapp.MatchStatus;

import java.time.LocalDateTime;

@Entity
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dateTime;

    @ManyToOne
    private Referee referee;

    @ManyToOne
    private Stadium stadium;

    @ManyToOne
    private League league;

    private String round;

    private int duration;

    @Enumerated(EnumType.STRING)
    private MatchStatus status;
    @ManyToOne
    private Team homeTeam; // Nowe pole dla drużyny gospodarzy

    @ManyToOne
    private Team awayTeam; // Nowe pole dla drużyny gości

    private int homeGoals;
    private int awayGoals;

    public int getHomeGoals() {
        return homeGoals;
    }

    public void setHomeGoals(int homeGoals) {
        this.homeGoals = homeGoals;
    }

    public int getAwayGoals() {
        return awayGoals;
    }

    public void setAwayGoals(int awayGoals) {
        this.awayGoals = awayGoals;
    }
//    @PrePersist
//    @PreUpdate
//    public void updateStatus() {
//        LocalDateTime now = LocalDateTime.now();
//        if (now.isBefore(dateTime)) {
//            this.status = MatchStatus.UPCOMING;
//        } else if (now.isBefore(dateTime.plus(duration, ChronoUnit.MINUTES))) {
//            this.status = MatchStatus.IN_PLAY;
//        } else {
//            this.status = MatchStatus.FINISHED;
//        }
//    }

    private double homePossession;
    private double awayPossession;

    private int homePasses;
    private int awayPasses;

    private int homeAccuratePasses;
    private int awayAccuratePasses;

    private int homeShots;
    private int awayShots;

    private int homeShotsOnGoal;
    private int awayShotsOnGoal;

    private int homeCorners;
    private int awayCorners;

    private int homeOffside;
    private int awayOffside;

    private int homeFouls;
    private int awayFouls;

    @ManyToOne
    private LeagueGroup group;

    @ManyToOne
    private LeagueStage stage; // Zmieniono z Phase na Stage

    @JsonProperty("isBetable")
    @Column(name = "is_betable")
    private Boolean isBetable;

    public Boolean getBetable() {
        return isBetable;
    }

    public void setBetable(Boolean betable) {
        isBetable = betable;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public Referee getReferee() {
        return referee;
    }

    public void setReferee(Referee referee) {
        this.referee = referee;
    }

    public Stadium getStadium() {
        return stadium;
    }

    public void setStadium(Stadium stadium) {
        this.stadium = stadium;
    }

    public League getLeague() {
        return league;
    }

    public void setLeague(League league) {
        this.league = league;
    }

    public String getRound() {
        return round;
    }

    public void setRound(String round) {
        this.round = round;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public MatchStatus getStatus() {
        return status;
    }

    public void setStatus(MatchStatus status) {
        this.status = status;
    }

    public double getHomePossession() {
        return homePossession;
    }

    public void setHomePossession(double homePossession) {
        this.homePossession = homePossession;
    }

    public double getAwayPossession() {
        return awayPossession;
    }

    public void setAwayPossession(double awayPossession) {
        this.awayPossession = awayPossession;
    }

    public int getHomePasses() {
        return homePasses;
    }

    public void setHomePasses(int homePasses) {
        this.homePasses = homePasses;
    }

    public int getAwayPasses() {
        return awayPasses;
    }

    public void setAwayPasses(int awayPasses) {
        this.awayPasses = awayPasses;
    }

    public int getHomeAccuratePasses() {
        return homeAccuratePasses;
    }

    public void setHomeAccuratePasses(int homeAccuratePasses) {
        this.homeAccuratePasses = homeAccuratePasses;
    }

    public int getAwayAccuratePasses() {
        return awayAccuratePasses;
    }

    public void setAwayAccuratePasses(int awayAccuratePasses) {
        this.awayAccuratePasses = awayAccuratePasses;
    }

    public int getHomeShots() {
        return homeShots;
    }

    public void setHomeShots(int homeShots) {
        this.homeShots = homeShots;
    }

    public int getAwayShots() {
        return awayShots;
    }

    public void setAwayShots(int awayShots) {
        this.awayShots = awayShots;
    }

    public int getHomeShotsOnGoal() {
        return homeShotsOnGoal;
    }

    public void setHomeShotsOnGoal(int homeShotsOnGoal) {
        this.homeShotsOnGoal = homeShotsOnGoal;
    }

    public int getAwayShotsOnGoal() {
        return awayShotsOnGoal;
    }

    public void setAwayShotsOnGoal(int awayShotsOnGoal) {
        this.awayShotsOnGoal = awayShotsOnGoal;
    }

    public int getHomeCorners() {
        return homeCorners;
    }

    public void setHomeCorners(int homeCorners) {
        this.homeCorners = homeCorners;
    }

    public int getAwayCorners() {
        return awayCorners;
    }

    public void setAwayCorners(int awayCorners) {
        this.awayCorners = awayCorners;
    }

    public int getHomeOffside() {
        return homeOffside;
    }

    public void setHomeOffside(int homeOffside) {
        this.homeOffside = homeOffside;
    }

    public int getAwayOffside() {
        return awayOffside;
    }

    public void setAwayOffside(int awayOffside) {
        this.awayOffside = awayOffside;
    }

    public int getHomeFouls() {
        return homeFouls;
    }

    public void setHomeFouls(int homeFouls) {
        this.homeFouls = homeFouls;
    }

    public int getAwayFouls() {
        return awayFouls;
    }

    public void setAwayFouls(int awayFouls) {
        this.awayFouls = awayFouls;
    }

    // Gettery i settery dla nowych pól
    public Team getHomeTeam() {
        return homeTeam;
    }

    public void setHomeTeam(Team homeTeam) {
        this.homeTeam = homeTeam;
    }

    public Team getAwayTeam() {
        return awayTeam;
    }

    public void setAwayTeam(Team awayTeam) {
        this.awayTeam = awayTeam;
    }

    public LeagueGroup getGroup() {
        return group;
    }

    public void setGroup(LeagueGroup group) {
        this.group = group;
    }

    public LeagueStage getStage() {
        return stage;
    }

    public void setStage(LeagueStage stage) {
        this.stage = stage;
    }

    @Override
    public String toString() {
        return "Match{" +
                "id=" + id +
                ", dateTime=" + dateTime +
                ", referee=" + (referee != null ? referee.getId() : null) +
                ", stadium=" + (stadium != null ? stadium.getId() : null) +
                ", league=" + (league != null ? league.getId() : null) +
                ", homeTeam=" + (homeTeam != null ? homeTeam.getId() : null) +
                ", awayTeam=" + (awayTeam != null ? awayTeam.getId() : null) +
                ", round='" + round + '\'' +
                ", isBetable=" + isBetable +
                ", duration=" + duration +
                ", status=" + status +
                ", stage=" + (stage != null ? stage.getId() + " (" + stage.getName() + ")" : null) +
                '}';
    }

}