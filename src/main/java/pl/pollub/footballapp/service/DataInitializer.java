package pl.pollub.footballapp.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.model.LeagueStage;
import pl.pollub.footballapp.model.Position;
import pl.pollub.footballapp.repository.CountryRepository;
import pl.pollub.footballapp.repository.LeagueStageRepository;
import pl.pollub.footballapp.repository.PositionRepository;

import java.io.File;
import java.util.Arrays;
import java.util.List;

@Service
public class DataInitializer {

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    public DataInitializer(CountryRepository countryRepository, PositionRepository positionRepository) {
        this.countryRepository = countryRepository;
        this.positionRepository = positionRepository;
    }


    @Autowired
    private LeagueStageRepository leagueStageRepository;

    @PostConstruct
    public void initializeCountries() {
        if (countryRepository.count() == 0) {
            List<String[]> countries = Arrays.asList(
                    new String[]{"Afghanistan", "af"},
                    new String[]{"Africa", "ww"},
                    new String[]{"Albania", "al"},
                    new String[]{"Algeria", "dz"},
                    new String[]{"Andorra", "ad"},
                    new String[]{"Angola", "ao"},
                    new String[]{"Antarctica", "ww"},
                    new String[]{"Antigua and Barbuda", "ag"},
                    new String[]{"Argentina", "ar"},
                    new String[]{"Armenia", "am"},
                    new String[]{"Asia", "ww"},
                    new String[]{"Australia", "au"},
                    new String[]{"Australia", "ww"},
                    new String[]{"Austria", "at"},
                    new String[]{"Azerbaijan", "az"},
                    new String[]{"Bahamas", "bs"},
                    new String[]{"Bahrain", "bh"},
                    new String[]{"Bangladesh", "bd"},
                    new String[]{"Barbados", "bb"},
                    new String[]{"Belarus", "by"},
                    new String[]{"Belgium", "be"},
                    new String[]{"Belize", "bz"},
                    new String[]{"Benin", "bj"},
                    new String[]{"Bhutan", "bt"},
                    new String[]{"Bolivia", "bo"},
                    new String[]{"Bosnia and Herzegovina", "ba"},
                    new String[]{"Botswana", "bw"},
                    new String[]{"Brazil", "br"},
                    new String[]{"Brunei", "bn"},
                    new String[]{"Bulgaria", "bg"},
                    new String[]{"Burkina Faso", "bf"},
                    new String[]{"Burundi", "bi"},
                    new String[]{"Cambodia", "kh"},
                    new String[]{"Cameroon", "cm"},
                    new String[]{"Canada", "ca"},
                    new String[]{"Cape Verde", "cv"},
                    new String[]{"Central African Republic", "cf"},
                    new String[]{"Chad", "td"},
                    new String[]{"Chile", "cl"},
                    new String[]{"China", "cn"},
                    new String[]{"Colombia", "co"},
                    new String[]{"Comoros", "km"},
                    new String[]{"Congo", "cg"},
                    new String[]{"Congo (Democratic Republic)", "cd"},
                    new String[]{"Costa Rica", "cr"},
                    new String[]{"Croatia", "hr"},
                    new String[]{"Cuba", "cu"},
                    new String[]{"Cyprus", "cy"},
                    new String[]{"Czech Republic", "cz"},
                    new String[]{"Denmark", "dk"},
                    new String[]{"Djibouti", "dj"},
                    new String[]{"Dominica", "dm"},
                    new String[]{"Dominican Republic", "do"},
                    new String[]{"Ecuador", "ec"},
                    new String[]{"Egypt", "eg"},
                    new String[]{"El Salvador", "sv"},
                    new String[]{"England", "en"},
                    new String[]{"Equatorial Guinea", "gq"},
                    new String[]{"Eritrea", "er"},
                    new String[]{"Estonia", "ee"},
                    new String[]{"Eswatini", "sz"},
                    new String[]{"Ethiopia", "et"},
                    new String[]{"Europe", "eu"},
                    new String[]{"Fiji", "fj"},
                    new String[]{"Finland", "fi"},
                    new String[]{"France", "fr"},
                    new String[]{"Gabon", "ga"},
                    new String[]{"Gambia", "gm"},
                    new String[]{"Georgia", "ge"},
                    new String[]{"Germany", "de"},
                    new String[]{"Ghana", "gh"},
                    new String[]{"Greece", "gr"},
                    new String[]{"Grenada", "gd"},
                    new String[]{"Guatemala", "gt"},
                    new String[]{"Guinea", "gn"},
                    new String[]{"Guinea-Bissau", "gw"},
                    new String[]{"Guyana", "gy"},
                    new String[]{"Haiti", "ht"},
                    new String[]{"Honduras", "hn"},
                    new String[]{"Hungary", "hu"},
                    new String[]{"Iceland", "is"},
                    new String[]{"India", "in"},
                    new String[]{"Indonesia", "id"},
                    new String[]{"Iran", "ir"},
                    new String[]{"Iraq", "iq"},
                    new String[]{"Ireland", "ie"},
                    new String[]{"Israel", "il"},
                    new String[]{"Italy", "it"},
                    new String[]{"Ivory Coast", "ci"},
                    new String[]{"Jamaica", "jm"},
                    new String[]{"Japan", "jp"},
                    new String[]{"Jordan", "jo"},
                    new String[]{"Kazakhstan", "kz"},
                    new String[]{"Kenya", "ke"},
                    new String[]{"Kiribati", "ki"},
                    new String[]{"Kosovo", "xk"},
                    new String[]{"Kuwait", "kw"},
                    new String[]{"Kyrgyzstan", "kg"},
                    new String[]{"Laos", "la"},
                    new String[]{"Latvia", "lv"},
                    new String[]{"Lebanon", "lb"},
                    new String[]{"Lesotho", "ls"},
                    new String[]{"Liberia", "lr"},
                    new String[]{"Libya", "ly"},
                    new String[]{"Liechtenstein", "li"},
                    new String[]{"Lithuania", "lt"},
                    new String[]{"Luxembourg", "lu"},
                    new String[]{"Madagascar", "mg"},
                    new String[]{"Malawi", "mw"},
                    new String[]{"Malaysia", "my"},
                    new String[]{"Maldives", "mv"},
                    new String[]{"Mali", "ml"},
                    new String[]{"Malta", "mt"},
                    new String[]{"Marshall Islands", "mh"},
                    new String[]{"Mauritania", "mr"},
                    new String[]{"Mauritius", "mu"},
                    new String[]{"Mexico", "mx"},
                    new String[]{"Micronesia", "fm"},
                    new String[]{"Moldova", "md"},
                    new String[]{"Monaco", "mc"},
                    new String[]{"Mongolia", "mn"},
                    new String[]{"Montenegro", "me"},
                    new String[]{"Morocco", "ma"},
                    new String[]{"Mozambique", "mz"},
                    new String[]{"Myanmar", "mm"},
                    new String[]{"Namibia", "na"},
                    new String[]{"Nauru", "nr"},
                    new String[]{"Nepal", "np"},
                    new String[]{"Netherlands", "nl"},
                    new String[]{"New Zealand", "nz"},
                    new String[]{"Nicaragua", "ni"},
                    new String[]{"Niger", "ne"},
                    new String[]{"Nigeria", "ng"},
                    new String[]{"North America", "ww"},
                    new String[]{"North Korea", "kp"},
                    new String[]{"North Macedonia", "mk"},
                    new String[]{"Northern Ireland", "ii"},
                    new String[]{"Norway", "no"},
                    new String[]{"Oman", "om"},
                    new String[]{"Pakistan", "pk"},
                    new String[]{"Palau", "pw"},
                    new String[]{"Panama", "pa"},
                    new String[]{"Papua New Guinea", "pg"},
                    new String[]{"Paraguay", "py"},
                    new String[]{"Peru", "pe"},
                    new String[]{"Philippines", "ph"},
                    new String[]{"Poland", "pl"},
                    new String[]{"Portugal", "pt"},
                    new String[]{"Qatar", "qa"},
                    new String[]{"Romania", "ro"},
                    new String[]{"Russia", "ru"},
                    new String[]{"Rwanda", "rw"},
                    new String[]{"Saint Kitts and Nevis", "kn"},
                    new String[]{"Saint Lucia", "lc"},
                    new String[]{"Saint Vincent and the Grenadines", "vc"},
                    new String[]{"Samoa", "ws"},
                    new String[]{"San Marino", "sm"},
                    new String[]{"Sao Tome and Principe", "st"},
                    new String[]{"Saudi Arabia", "sa"},
                    new String[]{"Scotland", "xs"},
                    new String[]{"Senegal", "sn"},
                    new String[]{"Serbia", "rs"},
                    new String[]{"Seychelles", "sc"},
                    new String[]{"Sierra Leone", "sl"},
                    new String[]{"Singapore", "sg"},
                    new String[]{"Slovakia", "sk"},
                    new String[]{"Slovenia", "si"},
                    new String[]{"Solomon Islands", "sb"},
                    new String[]{"Somalia", "so"},
                    new String[]{"South Africa", "za"},
                    new String[]{"South America", "ww"},
                    new String[]{"South Korea", "kr"},
                    new String[]{"South Sudan", "ss"},
                    new String[]{"Spain", "es"},
                    new String[]{"Sri Lanka", "lk"},
                    new String[]{"Sudan", "sd"},
                    new String[]{"Suriname", "sr"},
                    new String[]{"Swaziland", "sz"},
                    new String[]{"Sweden", "se"},
                    new String[]{"Switzerland", "ch"},
                    new String[]{"Syria", "sy"},
                    new String[]{"Taiwan", "tw"},
                    new String[]{"Tajikistan", "tj"},
                    new String[]{"Tanzania", "tz"},
                    new String[]{"Thailand", "th"},
                    new String[]{"Timor-Leste", "tl"},
                    new String[]{"Togo", "tg"},
                    new String[]{"Tonga", "to"},
                    new String[]{"Trinidad and Tobago", "tt"},
                    new String[]{"Tunisia", "tn"},
                    new String[]{"Turkey", "tr"},
                    new String[]{"Turkmenistan", "tm"},
                    new String[]{"Tuvalu", "tv"},
                    new String[]{"Uganda", "ug"},
                    new String[]{"Ukraine", "ua"},
                    new String[]{"United Arab Emirates", "ae"},
                    new String[]{"United Kingdom", "gb"},
                    new String[]{"United States", "us"},
                    new String[]{"Uruguay", "uy"},
                    new String[]{"Uzbekistan", "uz"},
                    new String[]{"Vanuatu", "vu"},
                    new String[]{"Vatican City", "va"},
                    new String[]{"Venezuela", "ve"},
                    new String[]{"Vietnam", "vn"},
                    new String[]{"Wales", "wl"},
                    new String[]{"World", "ww"},
                    new String[]{"Yemen", "ye"},
                    new String[]{"Zambia", "zm"},
                    new String[]{"Zimbabwe", "zw"}
            );

            for (String[] country : countries) {
                countryRepository.save(new Country(country[0], country[1]));
            }
            System.out.println("Countries table initialized with default data.");
        } else {
            System.out.println("Countries table already populated.");
        }
    }

    @Autowired
    private PositionRepository positionRepository;

    @PostConstruct
    public void initPositions() {
        if (positionRepository.count() == 0) {
            List<Position> positions = Arrays.asList(
                    new Position("Goalkeeper", "GK"),
                    new Position("Center Back", "CB"),
                    new Position("Left Back", "LB"),
                    new Position("Right Back", "RB"),
                    new Position("Left Wing Back", "LWB"),
                    new Position("Right Wing Back", "RWB"),
                    new Position("Defensive Midfielder", "CDM"),
                    new Position("Central Midfielder", "CM"),
                    new Position("Left Midfielder", "LM"),
                    new Position("Right Midfielder", "RM"),
                    new Position("Attacking Midfielder", "CAM"),
                    new Position("Left Winger", "LW"),
                    new Position("Right Winger", "RW"),
                    new Position("Center Forward", "CF")
            );
            positionRepository.saveAll(positions);
        }
    }

    @PostConstruct
    public void initializeLeagueStages() {
        if (leagueStageRepository.count() == 0) {
            List<LeagueStage> stages = Arrays.asList(
                    new LeagueStage("GROUP"),
                    new LeagueStage("1/256"),
                    new LeagueStage("1/128"),
                    new LeagueStage("1/64"),
                    new LeagueStage("1/32"),
                    new LeagueStage("1/16"),
                    new LeagueStage("1/8"),
                    new LeagueStage("1/4"),
                    new LeagueStage("1/2"),
                    new LeagueStage("FINAL"),
                    new LeagueStage("OTHER")
            );
            leagueStageRepository.saveAll(stages);
            System.out.println("League stages initialized.");
        } else {
            System.out.println("League stages already populated.");
        }
    }

    @PostConstruct
    public void checkFilesOnStartup() {
        System.out.println("Sprawdzanie plików w katalogu przy starcie aplikacji:");
        File folder = new File("D:/footballapp_files/images/player/");
        if (folder.exists() && folder.isDirectory()) {
            for (File file : folder.listFiles()) {
                System.out.println(file.getName());
            }
        } else {
            System.out.println("Katalog nie istnieje lub nie jest folderem.");
        }
    }


}
