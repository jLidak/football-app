package pl.pollub.footballapp.requests;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PlayerRequest {

    private Long id; // Needed for updating a player
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String nickname;
    private String picture;
    private Long positionId; // Foreign key, referencing Position entity
    private Long countryId;  // Foreign key, referencing Country entity

    public PlayerRequest(String firstName, String lastName, String dateOfBirth, String nickname, Long positionId, Long countryId, BigDecimal value) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = LocalDate.parse(dateOfBirth);
        this.nickname = nickname;
        this.positionId = positionId;
        this.countryId = countryId;
        this.value = value;
    }
//    private Long clubId;     // Foreign key, referencing Team entity (only if the team is a club)
//    private Long nationalTeamId; // Foreign key, referencing Team entity (only if the team is a national team)

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    private BigDecimal value; // Add value field


    // Constructors, getters, and setters

    public PlayerRequest() {
    }

    public PlayerRequest(Long id, String firstName, String lastName, LocalDate dateOfBirth, String nickname,
                         String picture, Long positionId, Long countryId) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.nickname = nickname;
        this.picture = picture;
        this.positionId = positionId;
        this.countryId = countryId;
//        this.clubId = clubId;
//        this.nationalTeamId = nationalTeamId;
    }

    public PlayerRequest(String firstName, String lastName, LocalDate dateOfBirth, String nickname, Long positionId, Long countryId, BigDecimal value) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.nickname = nickname;
        this.positionId = positionId;
        this.countryId = countryId;
        this.value = value;
    }

    public PlayerRequest(String firstName, String lastName, LocalDate dateOfBirth, String nickname, String picture,
                         Long positionId, Long countryId, BigDecimal value) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.nickname = nickname;
        this.picture = picture;
        this.positionId = positionId;
        this.countryId = countryId;
//        this.clubId = clubId;
//        this.nationalTeamId = nationalTeamId;
        this.value = value;
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

    public Long getPositionId() {
        return positionId;
    }

    public void setPositionId(Long positionId) {
        this.positionId = positionId;
    }

    public Long getCountryId() {
        return countryId;
    }

    public void setCountryId(Long countryId) {
        this.countryId = countryId;
    }

//    public Long getClubId() { return clubId; }
//    public void setClubId(Long clubId) { this.clubId = clubId; }
//
//    public Long getNationalTeamId() { return nationalTeamId; }
//    public void setNationalTeamId(Long nationalTeamId) { this.nationalTeamId = nationalTeamId; }
}
