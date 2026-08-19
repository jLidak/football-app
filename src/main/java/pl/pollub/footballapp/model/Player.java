package pl.pollub.footballapp.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String nickname;
    private String picture;
    private BigDecimal value = BigDecimal.ZERO;

    @ManyToOne
    @JoinColumn(name = "position_id")
    private Position position;


    //@JoinColumn(name = "country_id", nullable = false)
    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;

//    @ManyToOne
//    @JoinColumn(name = "club_id")
//    private Team club;
//
//    @ManyToOne
//    @JoinColumn(name = "national_team_id")
//    private Team nationalTeam;

    // Getters and Setters

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = true)
    private Team team;

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public Position getPosition() {
        return position;
    }

    public void setPosition(Position position) {
        this.position = position;
    }

    public Country getCountry() {
        return country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

//    public Team getClub() {
//        return club;
//    }
//
//    public void setClub(Team club) {
//        this.club = club;
//    }
//
//    public Team getNationalTeam() {
//        return nationalTeam;
//    }
//
//    public void setNationalTeam(Team nationalTeam) {
//        this.nationalTeam = nationalTeam;
//    }
}
