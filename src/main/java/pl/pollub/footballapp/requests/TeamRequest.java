package pl.pollub.footballapp.requests;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TeamRequest {

    private String name;
    private String picture;
    @JsonProperty("isClub")

    private boolean isClub;
    private Long leagueId; // ID ligi

    // Konstruktor, gettery, settery

    public TeamRequest(String name, String picture, boolean isClub, Long leagueId) {
        this.name = name;
        this.picture = picture;
        this.isClub = isClub;
        this.leagueId = leagueId;
    }

    public TeamRequest(String name, boolean isClub, Long leagueId) {
        this.name = name;
        this.isClub = isClub;
        this.leagueId = leagueId;
    }

    public TeamRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public boolean isClub() {
        return isClub;
    }

    public void setClub(boolean club) {
        isClub = club;
    }


    public Long getLeagueId() {
        return leagueId;
    }

    public void setLeagueId(Long leagueId) {
        this.leagueId = leagueId;
    }
}