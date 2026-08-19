package pl.pollub.footballapp.model;

import jakarta.persistence.*;

import java.util.Optional;

@Entity
public class MatchSquad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private boolean isHomeTeam;

    @ManyToOne(optional = false)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @ManyToOne(optional = false)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @Column(nullable = false)
    private boolean firstSquad;

    @Column(nullable = true)
    private Integer minutesPlayed;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isHomeTeam() {
        return isHomeTeam;
    }

    public void setHomeTeam(boolean homeTeam) {
        isHomeTeam = homeTeam;
    }

    public Match getMatch() {
        return match;
    }

    public void setMatch(Match match) {
        this.match = match;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public boolean isFirstSquad() {
        return firstSquad;
    }

    public void setFirstSquad(boolean firstSquad) {
        this.firstSquad = firstSquad;
    }

    public Optional<Integer> getMinutesPlayed() {
        return Optional.ofNullable(minutesPlayed);
    }

    public void setMinutesPlayed(Integer minutesPlayed) {
        this.minutesPlayed = minutesPlayed;
    }
}
