package pl.pollub.footballapp.exception;

import pl.pollub.footballapp.requests.StadiumRequest;

import java.util.List;

public class DuplicateStadiumsException extends RuntimeException {
    private List<StadiumRequest> duplicateStadiums;

    public DuplicateStadiumsException(List<StadiumRequest> duplicateStadiums) {
        super("Duplicate stadiums found.");
        this.duplicateStadiums = duplicateStadiums;
    }

    public List<StadiumRequest> getDuplicateStadiums() {
        return duplicateStadiums;
    }
}
