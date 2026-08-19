package pl.pollub.footballapp.requests;

import java.time.LocalDate;

public class InjuryRequest {
    private String type;
    private LocalDate startDate;
    private LocalDate endDate;  // This field can be null
    private Long playerId;

    // Constructor
    public InjuryRequest(String type, LocalDate startDate, LocalDate endDate, Long playerId) {
        this.type = type;
        this.startDate = startDate;
        this.endDate = endDate;
        this.playerId = playerId;
    }

    public InjuryRequest() {
    }

//    @JsonCreator
//    public InjuryRequest(
//            @JsonProperty("type") String type,
//            @JsonProperty("startDate") LocalDate startDate,
//            @JsonProperty("endDate") LocalDate endDate,
//            @JsonProperty("playerId") Long playerId
//    ) {
//        this.type = type;
//        this.startDate = startDate;
//        this.endDate = endDate;
//        this.playerId = playerId;
//    }


    // Getters and Setters

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }
}
