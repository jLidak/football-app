package pl.pollub.footballapp.service.importer;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import pl.pollub.footballapp.service.importer.CsvStadiumImporter;
import pl.pollub.footballapp.service.importer.JsonStadiumImporter;
import pl.pollub.footballapp.service.importer.DataImporter;
import pl.pollub.footballapp.service.importer.CsvCoachImporter;

@Component
public class ImporterFactory {

    @Autowired
    private CsvCityImporter csvCityImporter;
    @Autowired
    private JsonCityImporter jsonCityImporter;

    @Autowired
    private JsonStadiumImporter jsonStadiumImporter;

    @Autowired
    private CsvStadiumImporter csvStadiumImporter;

    @Autowired
    private CsvLeagueImporter csvLeagueImporter;

    @Autowired
    private JsonLeagueImporter jsonLeagueImporter;

    @Autowired
    private CsvCoachImporter csvCoachImporter;

    @Autowired
    private JsonCoachImporter jsonCoachImporter;
    @Autowired
    private JsonInjuryImporter jsonInjuryImporter;
    @Autowired
    private CsvInjuryImporter csvInjuryImporter;


    public DataImporter getImporter(String fileType) {
        if ("json".equalsIgnoreCase(fileType)) {
            return jsonStadiumImporter;
        } else if ("csv".equalsIgnoreCase(fileType)) {
            return csvStadiumImporter;
        } else {
            throw new IllegalArgumentException("Unsupported file type: " + fileType);
        }
    }

    public DataImporter getImporterLeague(String fileType) {
        if ("json".equalsIgnoreCase(fileType)) {
            return jsonLeagueImporter;
        } else if ("csv".equalsIgnoreCase(fileType)) {
            return csvLeagueImporter;
        } else {
            throw new IllegalArgumentException("Unsupported file type: " + fileType);
        }
    }

    public DataImporter getImporterCoach(String fileType) {
        if ("json".equalsIgnoreCase(fileType)) {
            return jsonCoachImporter;
        } else if ("csv".equalsIgnoreCase(fileType)) {
            return csvCoachImporter;
        } else {
            throw new IllegalArgumentException("Unsupported file type: " + fileType);
        }
    }

    public DataImporter getImporterCity(String fileType) {
        if (fileType.equalsIgnoreCase("csv")) {
            return csvCityImporter;
        } else if (fileType.equalsIgnoreCase("json")) {
            return jsonCityImporter;
        } else {
            throw new IllegalArgumentException("Unsupported file type: " + fileType);
        }
    }

    public DataImporter getImporterTeam(String fileType) {
        if (fileType.equalsIgnoreCase("csv")) {
            return new CsvTeamImporter();
        } else if (fileType.equalsIgnoreCase("json")) {
            return new JsonTeamImporter();
        } else {
            throw new IllegalArgumentException("Unsupported file type: " + fileType);
        }
    }

    public DataImporter getImporterReferee(String fileType) {
        if (fileType.equalsIgnoreCase("csv")) {
            return new CsvRefereeImporter();
        } else if (fileType.equalsIgnoreCase("json")) {
            return new JsonRefereeImporter();
        } else {
            throw new IllegalArgumentException("Unsupported file type: " + fileType);
        }
    }

    public DataImporter getImporterPlayer(String fileType) {
        if (fileType.equalsIgnoreCase("csv")) {
            return new CsvPlayerImporter();
        } else if (fileType.equalsIgnoreCase("json")) {
            return new JsonPlayerImporter();
        } else {
            throw new IllegalArgumentException("Unsupported file type: " + fileType);
        }
    }

    public DataImporter getImporterInjury(String fileType) {
        if ("json".equalsIgnoreCase(fileType)) {
            return jsonInjuryImporter;
        } else if ("csv".equalsIgnoreCase(fileType)) {
            return csvInjuryImporter;
        } else {
            throw new IllegalArgumentException("Unsupported file type: " + fileType);
        }
    }

}