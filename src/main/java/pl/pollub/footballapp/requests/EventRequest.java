package pl.pollub.footballapp.requests;

import pl.pollub.footballapp.EventType;

import java.time.LocalDateTime;

public class EventRequest {
    private Long matchId;
    private Long playerId;
    private int minute;
    private String partOfGame;
    private EventType type;
    private LocalDateTime dateTime; // Nowe pole

    // Getters and Setters
    public Long getMatchId() {
        return matchId;
    }

    public void setMatchId(Long matchId) {
        this.matchId = matchId;
    }

    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }

    public int getMinute() {
        return minute;
    }

    public void setMinute(int minute) {
        this.minute = minute;
    }

    public String getPartOfGame() {
        return partOfGame;
    }

    public void setPartOfGame(String partOfGame) {
        this.partOfGame = partOfGame;
    }

    public EventType getType() {
        return type;
    }

    public void setType(EventType type) {
        this.type = type;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }
}
