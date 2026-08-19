package pl.pollub.footballapp.requests;

public class LeagueRequest {
    private String name;
    private String countryName;
    private String edition;

    public LeagueRequest() {
    }

    public LeagueRequest(String name, String countryName, String edition) {
        this.name = name;
        this.countryName = countryName;
        this.edition = edition;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCountryName() {
        return countryName;
    }

    public void setCountryName(String countryName) {
        this.countryName = countryName;
    }

    public String getEdition() {
        return edition;
    }

    public void setEdition(String edition) {
        this.edition = edition;
    }
}
