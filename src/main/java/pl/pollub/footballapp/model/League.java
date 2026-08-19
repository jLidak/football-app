package pl.pollub.footballapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class League {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String edition;

    @JsonIgnore
    @OneToMany(mappedBy = "league")
    private List<LeagueGroup> groups;

    public List<LeagueGroup> getGroups() {
        return groups;
    }

    public void setGroups(List<LeagueGroup> groups) {
        this.groups = groups;
    }

    public Team getWinner() {
        return winner;
    }

    public void setWinner(Team winner) {
        this.winner = winner;
    }

    @OneToOne
    private Team winner;
    @ManyToOne
    @JoinColumn(name = "country_id", referencedColumnName = "id")
    private Country country;

    // Constructors, Getters, and Setters
    public League() {
    }

    public League(String name, String edition, Country country) {
        this.name = name;
        this.edition = edition;
        this.country = country;
    }

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

    public String getEdition() {
        return edition;
    }

    public void setEdition(String edition) {
        this.edition = edition;
    }

    public Country getCountry() {
        return country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }
}
